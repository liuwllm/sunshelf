import * as React from 'react'
import '@/styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import { Inter } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
})

export default function App({ 
  Component, 
  pageProps: { session, ...pageProps }, 
}) {
  return (
    <ChakraProvider className={inter.className}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
