import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ToastProvider } from 'react-toast-notifications'
import { AuthProvider } from '@/lib/next-hook-auth'
import 'tailwindcss/tailwind.css'
import 'react-tippy/dist/tippy.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>September-Rain</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content="September-Rain" />
        <meta property="og:description" content="September-Rain" />
        <meta name="keywords" content="Kadunasa Sato portfolie" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.september-rsin.com/" />
        <meta
          property="og:image"
          content="https://www.september-rsin.com/images/og_image.jpg"
        />
        <meta property="og:site_name" content="September-Rain" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@susanoo" />
        <meta name="twitter:player" content="@susanoo" />
        <style tsx>{`
        .header {
          position: fixed;
          top: 0;
          width: 100%;
        }
        .footer {
          position: fixed;
          bottom: 0;
          width: 100%;
        }
        `}
        </style>
      </Head>
      <AuthProvider
        signinPath="/auth/sign_in"
        signoutPath="/auth/sign_out"
        signupPath="/account/sign_up"
        currentUserPath="/users/me"
        redirectPath="/"
        resourceName=""
      >
        <ToastProvider autoDismiss={true}>
          <Component {...pageProps} />
        </ToastProvider>
      </AuthProvider>
    </>
  )
}

export default MyApp
