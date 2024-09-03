import { Links, Meta, Scripts, ScrollRestoration } from '@remix-run/react'
import Header from './header'
import Footer from './footer'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  scriptNonce?: string
  styleNonce?: string
  hideNav?: boolean
}

export default function Layout (props: LayoutProps): JSX.Element {
  const { children, scriptNonce, hideNav } = props
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        <Header hideNav={hideNav} />
        <div className='container'>
          {children}
        </div>
        <Footer />
        {scriptNonce != null && (
          <>
            <ScrollRestoration nonce={scriptNonce} />
            <Scripts nonce={scriptNonce} />
          </>
        )}
      </body>
    </html>
  )
}
