'use client'

import { usePathname } from 'next/navigation'
import NextuneAssist from '@/components/SheNergyAssistV3'

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/'

  return (
    <>
      {children}
      {!isLoginPage && <NextuneAssist />}
    </>
  )
}
