import { Outlet, useLoaderData, useRouteError } from '@remix-run/react'
import { LinksFunction, LoaderFunctionArgs } from '@remix-run/node'
import Layout from './components/layout'
import Links from './links'

interface LoaderData {
  scriptNonce: string
  styleNonce: string
}

export const links: LinksFunction = () => {
  return Links
}

export function loader(args: LoaderFunctionArgs): LoaderData {
  const { context } = args
  const { scriptNonce, styleNonce } = context
  return {
    scriptNonce: (scriptNonce as string | undefined) ?? '',
    styleNonce: (styleNonce as string | undefined) ?? ''
  }
}

export default function App(): JSX.Element {
  const { scriptNonce, styleNonce } = useLoaderData<typeof loader>()
  return (
    <Layout scriptNonce={scriptNonce} styleNonce={styleNonce}>
      <Outlet />
    </Layout>
  )
}

export function ErrorBoundary(): JSX.Element {
  const error = useRouteError() as Error & {
    status: number
    statusText: string
  }
  return (
    <Layout hideNav>
      <div>
        <h1>Oh no, an error occurred!</h1>
        <h3>
          {error.status} {error.statusText}
        </h3>
        <pre>{error.stack}</pre>
      </div>
    </Layout>
  )
}
