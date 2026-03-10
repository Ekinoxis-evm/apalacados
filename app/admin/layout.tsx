'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Wrench,
  PlayCircle,
  Youtube,
  Calendar,
  TrendingUp,
  LogOut
} from 'lucide-react'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/tools', icon: Wrench, label: 'Herramientas' },
  { href: '/admin/xspaces', icon: PlayCircle, label: 'X Spaces' },
  { href: '/admin/youtube', icon: Youtube, label: 'YouTube' },
  { href: '/admin/events', icon: Calendar, label: 'Eventos' },
  { href: '/admin/alpha', icon: TrendingUp, label: 'Alpha Picks' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen grid-bg flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border-dark glass flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border-dark">
          <h1 className="font-chakra text-xl font-bold text-cyber-green tracking-wider">
            ADMIN PANEL
          </h1>
          <p className="font-outfit text-xs text-gray-500 mt-1">APALANCADOS</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-cyber-green/10 text-cyber-green border border-cyber-green/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-chakra text-sm tracking-wide">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border-dark">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-chakra text-sm tracking-wide">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
