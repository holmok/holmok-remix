import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError
} from '@remix-run/react'
import React from 'react'
import Header from './components/header'
import Footer from './components/footer'
import { LinksFunction, LoaderFunctionArgs } from '@remix-run/node'

export const links: LinksFunction = () => {
  return [
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png'
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png'
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png'
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest'
    },
    {
      rel: 'stylesheet',
      href: '/css/reset.css'
    },
    {
      rel: 'stylesheet',
      href: '/css/layout.css'
    },
    {
      rel: 'stylesheet',
      href: '/css/components.css'
    }
  ]
}

export default function App (): JSX.Element {
  const { scriptNonce } = useLoaderData<typeof loader>()
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        <Header />
        <div className='container'>
          <Outlet />
        </div>
        <Footer />
        <ScrollRestoration nonce={scriptNonce} />
        <Scripts nonce={scriptNonce} />
      </body>
    </html>
  )
}

export function loader (args: LoaderFunctionArgs): { scriptNonce: string } {
  const { context } = args
  const { scriptNonce } = context
  return { scriptNonce: scriptNonce as string | undefined ?? '' }
}

export function ErrorBoundary (): JSX.Element {
  const error = useRouteError() as Error
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        <Header hideNav />
        <div className='container'>
          <div>
            <h1>Oh no, an error occurred!</h1>
            <pre>{error.message}</pre>
          </div>
        </div>
        <Footer />
      </body>
    </html>
  )
}
