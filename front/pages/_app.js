import * as React from 'react'
import '@/styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import { Inter } from 'next/font/google'
import { SessionProvider } from "next-auth/react"

export const inter = Inter({
  subsets: ['latin'],
})

export default function App({ 
  Component, 
  pageProps: { session, ...pageProps }, 
}) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider className={inter.className}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  )
}
