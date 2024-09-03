import {
  Outlet,
  useLoaderData,
  useRouteError
} from '@remix-run/react'
import React from 'react'
import { LinksFunction, LoaderFunctionArgs } from '@remix-run/node'
import Layout from './components/layout'

interface LoaderData {
  scriptNonce: string
  styleNonce: string
}

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

export function loader (args: LoaderFunctionArgs): LoaderData {
  const { context } = args
  const { scriptNonce, styleNonce } = context
  return {
    scriptNonce: scriptNonce as string | undefined ?? '',
    styleNonce: styleNonce as string | undefined ?? ''
  }
}

export default function App (): JSX.Element {
  const { scriptNonce, styleNonce } = useLoaderData<typeof loader>()
  return (
    <Layout scriptNonce={scriptNonce} styleNonce={styleNonce}>
      <Outlet />
    </Layout>
  )
}

export function ErrorBoundary (): JSX.Element {
  const error = useRouteError() as Error & { status: number, statusText: string }
  return (
    <Layout hideNav>
      <div>
        <h1>Oh no, an error occurred!</h1>
        <h3>{error.status} {error.statusText}</h3>
      </div>
    </Layout>
  )
}
