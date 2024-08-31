import { PassThrough } from 'node:stream'
import type { AppLoadContext, EntryContext, LoaderFunctionArgs } from '@remix-run/node'
import { createReadableStreamFromReadable } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import { renderToPipeableStream } from 'react-dom/server'
import Pino from 'pino'

const ABORT_DELAY = 5_000

export function handleError (error: unknown, args: LoaderFunctionArgs): void {
  const { context } = args
  const { logger } = context
  const log = logger as Pino.Logger
  log.error(error, 'Error rendering page')
}

export default async function handleRequest (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext
): Promise<Response> {
  const { logger } = loadContext
  const log = logger as Pino.Logger
  return await new Promise((resolve, reject) => {
    let shellRendered = false
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        onShellReady () {
          shellRendered = true
          const body = new PassThrough()
          const stream = createReadableStreamFromReadable(body)

          responseHeaders.set('Content-Type', 'text/html')

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          )

          pipe(body)
        },
        onShellError (error: unknown) {
          reject(error)
        },
        onError (error: unknown) {
          responseStatusCode = 500
          if (shellRendered) {
            log.error(error)
          }
        }
      }
    )

    setTimeout(abort, ABORT_DELAY)
  })
}
