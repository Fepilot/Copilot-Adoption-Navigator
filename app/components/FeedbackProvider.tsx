'use client'

import { usePathname } from 'next/navigation'
import FeedbackWidget from '@/app/components/FeedbackWidget'
import { FeedbackPage } from '@/app/lib/feedback-schema'

export default function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Map pathname to FeedbackPage type
  const getCurrentPage = (): FeedbackPage => {
    if (pathname === '/') return 'landing'
    if (pathname === '/inputs') return 'inputs'
    if (pathname === '/results') return 'results'
    if (pathname === '/plans') return 'plans'
    if (pathname === '/evidence') return 'evidence'
    return 'general'
  }

  return (
    <>
      {children}
      <FeedbackWidget currentPage={getCurrentPage()} />
    </>
  )
}
