"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

type XSpace = {
  id: string
  title: string
  image_url: string
  space_url: string
  display_order: number
  created_at?: string
}

function useXSpaces() {
  const [xSpaces, setXSpaces] = useState<XSpace[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const supabase = createClient()
    const fetchSpaces = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('x_spaces')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data) setXSpaces(data)
      setLoading(false)
    }
    fetchSpaces()
  }, [])
  return { xSpaces, loading }
}

export default function XSpacesPage() {
  const { xSpaces, loading } = useXSpaces()
  return (
    <div className="min-h-screen grid-bg max-w-4xl mx-auto px-4 py-10 space-y-8">
      <h1 className="font-chakra text-2xl font-bold text-white tracking-wider mb-4">
        LIVE <span className="text-white">X SPACES</span>
      </h1>
      <div className="flex items-center gap-3 mb-4">
        <XIcon className="w-4 h-4 text-white" />
        <h2 className="font-chakra text-sm font-semibold text-white tracking-[0.15em]">X SPACES</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
        <a
          href="https://twitter.com/ApalancadosTech"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] tracking-widest text-gray-600 hover:text-white transition-colors"
          style={{ fontFamily: 'var(--font-dm-mono)' }}
        >
          @APALANCADOSTECH ↗
        </a>
      </div>
      {loading ? (
        <div className="text-center text-gray-500 py-8">Cargando X Spaces...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center max-w-4xl mx-auto">
          {xSpaces.map((space) => (
            <a
              key={space.id}
              href={space.space_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center rounded-xl overflow-hidden border border-border-dark neon-border bg-panel/40 hover:border-white/20 transition-all duration-200 p-4 w-full max-w-[220px] mx-auto"
            >
              {/* Chapter image */}
              <div className="relative w-[150px] h-[150px] overflow-hidden rounded-lg mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={space.image_url}
                  alt={space.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  width={150}
                  height={150}
                />
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30">
                  <div className="flex items-center gap-2 bg-black/70 border border-white/20 rounded-full px-4 py-2">
                    <XIcon className="w-4 h-4 text-white" />
                    <span className="text-[11px] tracking-widest text-white uppercase" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                      ABRIR SPACE ↗
                    </span>
                  </div>
                </div>
              </div>
              {/* Footer */}
              <div className="flex flex-col gap-1 w-full px-2 py-2 border-t border-border-dark">
                <div className="flex items-center justify-between">
                  <p className="font-chakra text-sm text-gray-300 tracking-wide line-clamp-2">{space.title}</p>
                  <XIcon className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                </div>
                {space.created_at && (
                  <span className="text-[11px] text-gray-500 font-mono">
                    {new Date(space.created_at).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
