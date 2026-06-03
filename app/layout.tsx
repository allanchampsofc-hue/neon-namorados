import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dia dos Namorados 2026 — Neon Pizzaria',
  description: 'Reserve sua mesa para o jantar especial de Dia dos Namorados na Neon Pizzaria. 12 de junho de 2026.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
