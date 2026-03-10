"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

type YouTubeVideo = {
  id: string
  video_id: string
  title: string
  display_order: number
  created_at?: string
}

function useYouTubeVideos() {
  const [youtubeVideos, setYouTubeVideos] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const supabase = createClient()
    const fetchVideos = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data) setYouTubeVideos(data)
      setLoading(false)
    }
    fetchVideos()
  }, [])
  return { youtubeVideos, loading }
}

export default function YouTubePage() {
  const { youtubeVideos, loading } = useYouTubeVideos()
  return (
    <div className="min-h-screen grid-bg max-w-4xl mx-auto px-4 py-10 space-y-8">
      <h1 className="font-chakra text-2xl font-bold text-white tracking-wider mb-4">
        LIVE <span className="text-[#ff4444]">YOUTUBE</span>
      </h1>
      <div className="flex items-center gap-3 mb-4">
        <YoutubeIcon className="w-4 h-4 text-[#ff4444]" />
        <h2 className="font-chakra text-sm font-semibold text-white tracking-[0.15em]">GRABACIONES</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-[#ff4444]/20 to-transparent" />
        <span className="section-label" style={{ color: '#ff4444' }}>{youtubeVideos.length} VIDEOS</span>
      </div>
      {loading ? (
        <div className="text-center text-gray-500 py-8">Cargando videos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {youtubeVideos.map((v) => (
            <div key={v.id} className="neon-border rounded-xl overflow-hidden bg-panel/40">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${v.video_id}`}
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={v.title}
                />
              </div>
              <div className="px-4 py-2.5 border-t border-border-dark flex flex-col gap-1">
                <p className="font-chakra text-xs text-gray-400">{v.title}</p>
                {v.created_at && (
                  <span className="text-[10px] text-gray-500 font-mono">
                    {new Date(v.created_at).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
