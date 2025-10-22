import type { Metadata } from 'next'
import './globals.css'
import FeedbackProvider from '@/app/components/FeedbackProvider'

export const metadata: Metadata = {
  title: 'Copilot Adoption Navigator',
  description: 'Turn Super User reports into targeted recommendations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <FeedbackProvider>{children}</FeedbackProvider>
      </body>
    </html>
  )
}
