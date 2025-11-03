import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'MUKTI\'S BIRTHDAY',
  description: 'MANSI\'S Birthday',
  generator: 'MANSI\'S Birthday',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <footer className="relative z-20 w-full mt-8">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mb-4" />
            <p className="text-center text-sm md:text-base font-semibold text-amber-700">
              <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-sm animate-pulse-glow">
                Made with ❤️ for <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent font-extrabold">MANSI</span>
              </span>
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
