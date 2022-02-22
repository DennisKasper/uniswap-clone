import 'tailwindcss/tailwind.css'

import type { AppProps } from 'next/app'
import { TransactionProvider } from '../contexts/transaction.context'


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TransactionProvider >
      <Component {...pageProps} />
    </TransactionProvider>
  )
}

export default MyApp
