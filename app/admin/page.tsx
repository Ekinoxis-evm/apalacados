'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Wrench, PlayCircle, Youtube, Calendar, ArrowRight } from 'lucide-react'

const quickLinks = [
  { href: '/admin/tools', icon: Wrench, label: 'Herramientas', description: 'Gestionar apps y proyectos' },
  { href: '/admin/xspaces', icon: PlayCircle, label: 'X Spaces', description: 'Subir grabaciones' },
  { href: '/admin/youtube', icon: Youtube, label: 'YouTube', description: 'Agregar videos' },
  { href: '/admin/events', icon: Calendar, label: 'Eventos', description: 'Gestionar eventos Luma' },
]

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ tools: 0, xspaces: 0, youtube: 0, events: 0 })
  const supabase = createClient()

  useEffect(() => {
    // Get user info
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Get stats
    Promise.all([
      supabase.from('tools').select('id', { count: 'exact', head: true }),
      supabase.from('x_spaces').select('id', { count: 'exact', head: true }),
      supabase.from('youtube_videos').select('id', { count: 'exact', head: true }),
      supabase.from('luma_events').select('id', { count: 'exact', head: true }),
    ]).then(([tools, xspaces, youtube, events]) => {
      setStats({
        tools: tools.count ?? 0,
        xspaces: xspaces.count ?? 0,
        youtube: youtube.count ?? 0,
        events: events.count ?? 0,
      })
    })
  }, [supabase])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-chakra text-3xl font-bold text-white mb-2">
          Bienvenido de vuelta
        </h1>
        <p className="font-outfit text-gray-400">
          {user?.email}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-panel/40 border border-border-dark rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <Wrench className="w-5 h-5 text-cyber-green" />
            <span className="font-chakra text-2xl font-bold text-white">{stats.tools}</span>
          </div>
          <p className="font-outfit text-sm text-gray-500">Herramientas</p>
        </div>
        <div className="bg-panel/40 border border-border-dark rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <PlayCircle className="w-5 h-5 text-cyber-green" />
            <span className="font-chakra text-2xl font-bold text-white">{stats.xspaces}</span>
          </div>
          <p className="font-outfit text-sm text-gray-500">X Spaces</p>
        </div>
        <div className="bg-panel/40 border border-border-dark rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <Youtube className="w-5 h-5 text-cyber-green" />
            <span className="font-chakra text-2xl font-bold text-white">{stats.youtube}</span>
          </div>
          <p className="font-outfit text-sm text-gray-500">Videos YouTube</p>
        </div>
        <div className="bg-panel/40 border border-border-dark rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-cyber-green" />
            <span className="font-chakra text-2xl font-bold text-white">{stats.events}</span>
          </div>
          <p className="font-outfit text-sm text-gray-500">Eventos</p>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="font-chakra text-lg font-semibold text-white mb-4">
          Acceso Rápido
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group bg-panel/40 border border-border-dark hover:border-cyber-green/30 rounded-xl p-6 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 rounded-lg bg-cyber-green/10 border border-cyber-green/20">
                    <Icon className="w-5 h-5 text-cyber-green" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-cyber-green transition-colors" />
                </div>
                <h3 className="font-chakra text-base font-semibold text-white mb-1">
                  {link.label}
                </h3>
                <p className="font-outfit text-sm text-gray-500">
                  {link.description}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
