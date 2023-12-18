'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <head>
          <title>Unscraper</title>
        </head>
        <body style={{ margin: 0 }}>{children}</body>
      </html>
    </QueryClientProvider>
  )
}
