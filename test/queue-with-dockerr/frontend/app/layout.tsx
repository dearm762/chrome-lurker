'use client'

import { Roboto } from "next/font/google"
import { Viewport } from 'next'
import ReadOnlyChild from '@/types/readonly-child'
import useOverflow from '@/hook/useOverflow'

import "@/globals.sass"

const inter = Roboto({ subsets: ["latin"], weight: '400' })

export const viewport: Viewport = {
  themeColor: '#F13446'
}

export default function RootLayout({
  children,
}: ReadOnlyChild) {
  const [overflow] = useOverflow()

  return (
    <html lang="en">
      <head>
        <title>e-kezek | Narxoz University</title>
        <link rel="icon" type="image/x-icon" href="favicon.ico" />
      </head>
      <body className={inter.className + overflow}>{children}</body>
    </html>
  )
}