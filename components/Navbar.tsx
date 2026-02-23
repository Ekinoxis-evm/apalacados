'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  ChevronDown,
  Menu,
  X,
  TrendingUp,
  Target,
  Layers,
  Smile,
  Brain,
} from 'lucide-react'

const topics = [
  { name: 'Trading & Perps', href: '/topics/trading', icon: TrendingUp, color: '#00ff41' },
  { name: 'Prediction Markets', href: '/topics/prediction', icon: Target, color: '#00d4ff' },
  { name: 'DeFi', href: '/topics/defi', icon: Layers, color: '#00fff0' },
  { name: 'Memes & NFTs', href: '/topics/memes', icon: Smile, color: '#bc13fe' },
  { name: 'Inteligencia Artificial', href: '/topics/ai', icon: Brain, color: '#ff006e' },
]


export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }, [pathname])

  const isActive = (href: string) => pathname === href

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border-dark">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyber-green/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative w-8 h-8 flex-shrink-0 transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(0,255,65,0.5)]">
              <Image
                src="/apalancadoslogo.jpg"
                alt="APALANCADOS logo"
                fill
                className="object-contain rounded-sm"
                priority
              />
            </div>
            <span className="font-chakra font-bold text-sm tracking-[0.18em] text-white group-hover:text-cyber-green transition-colors animate-flicker">
              APALANCADOS
            </span>
          </Link>

          {/* ── Desktop Nav — order: HOME · LIVE HUB · TOPICS · EVENTS ── */}
          <div className="hidden md:flex items-center gap-6">

            {/* HOME */}
            <Link
              href="/"
              className={`font-chakra text-xs tracking-widest transition-colors ${isActive('/') ? 'text-cyber-green' : 'text-gray-400 hover:text-white'}`}
            >
              HOME
            </Link>

            {/* LIVE HUB */}
            <Link
              href="/live-hub"
              className={`flex items-center gap-1.5 font-chakra text-xs tracking-widest transition-colors ${isActive('/live-hub') ? 'text-cyber-green' : 'text-gray-400 hover:text-white'}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-live-pulse" />
              LIVE HUB
            </Link>

            {/* TOPICS dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className={`flex items-center gap-1 font-chakra text-xs tracking-widest transition-colors py-1 ${
                  dropdownOpen ? 'text-cyber-green' : 'text-gray-400 hover:text-white'
                }`}
              >
                TOPICS
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-60 glass border border-border-dark rounded-lg overflow-hidden shadow-2xl shadow-black/70">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyber-green/30 to-transparent" />
                  {topics.map((t) => {
                    const Icon = t.icon
                    return (
                      <Link
                        key={t.href}
                        href={t.href}
                        className="group/item flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-colors"
                      >
                        <div className="p-1 rounded" style={{ background: `${t.color}18` }}>
                          <Icon className="w-3.5 h-3.5" style={{ color: t.color }} />
                        </div>
                        <span className="font-outfit text-sm text-gray-400 group-hover/item:text-white transition-colors">
                          {t.name}
                        </span>
                        <span
                          className="ml-auto w-1 h-1 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity"
                          style={{ background: t.color, boxShadow: `0 0 6px ${t.color}` }}
                        />
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* EVENTS */}
            <Link
              href="/events"
              className={`font-chakra text-xs tracking-widest transition-colors ${isActive('/events') ? 'text-cyber-green' : 'text-gray-400 hover:text-white'}`}
            >
              EVENTS
            </Link>

          </div>

          {/* ── Mobile Toggle ── */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden text-gray-500 hover:text-cyber-green transition-colors p-1"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-border-dark">
          <div className="px-4 pt-3 pb-4 space-y-4">
            <div>
              <p className="section-label mb-2">TOPICS</p>
              <div className="space-y-0.5">
                {topics.map((t) => {
                  const Icon = t.icon
                  return (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="flex items-center gap-3 py-2 text-gray-500 hover:text-white transition-colors"
                    >
                      <Icon className="w-4 h-4" style={{ color: t.color }} />
                      <span className="font-outfit text-sm">{t.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
            <div className="border-t border-border-dark pt-3 space-y-2">
              <Link href="/" className={`block py-1.5 font-chakra text-xs tracking-widest transition-colors ${isActive('/') ? 'text-cyber-green' : 'text-gray-400 hover:text-cyber-green'}`}>
                HOME
              </Link>
              <Link href="/live-hub" className={`flex items-center gap-2 py-1.5 font-chakra text-xs tracking-widest transition-colors ${isActive('/live-hub') ? 'text-cyber-green' : 'text-gray-400 hover:text-cyber-green'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-live-pulse" />
                LIVE HUB
              </Link>
              <Link href="/events" className={`block py-1.5 font-chakra text-xs tracking-widest transition-colors ${isActive('/events') ? 'text-cyber-green' : 'text-gray-400 hover:text-cyber-green'}`}>
                EVENTS
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
