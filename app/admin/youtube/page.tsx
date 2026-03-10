'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Youtube as YoutubeIcon, X as XIcon } from 'lucide-react'

type Video = {
  id: string
  video_id: string
  title: string
  display_order: number
  created_at?: string
}

export default function YouTubePage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  
  const [formData, setFormData] = useState<{
    video_id: string
    title: string
    created_at?: string
  }>({
    video_id: '',
    title: '',
    created_at: '',
  })

  const supabase = createClient()

  const loadVideos = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('youtube_videos')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (!error && data) {
      setVideos(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadVideos()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { ...formData }
    if (!payload.created_at) delete payload.created_at
    if (editingVideo) {
      const { error } = await supabase
        .from('youtube_videos')
        .update(payload)
        .eq('id', editingVideo.id)
      if (!error) {
        await loadVideos()
        closeModal()
      }
    } else {
      const { error } = await supabase
        .from('youtube_videos')
        .insert([payload])
      if (!error) {
        await loadVideos()
        closeModal()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este video?')) return
    
    const { error } = await supabase
      .from('youtube_videos')
      .delete()
      .eq('id', id)
    
    if (!error) {
      await loadVideos()
    }
  }

  const openModal = (video?: Video) => {
    if (video) {
      setEditingVideo(video)
      setFormData({
        video_id: video.video_id,
        title: video.title,
        created_at: video.created_at ? video.created_at.slice(0, 16) : '',
      })
    } else {
      setEditingVideo(null)
      setFormData({
        video_id: '',
        title: '',
        created_at: '',
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingVideo(null)
    setFormData({
      video_id: '',
      title: '',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-chakra text-2xl font-bold text-white mb-1">
            Gestionar YouTube Videos
          </h1>
          <p className="font-outfit text-sm text-gray-500">
            Grabaciones de espacios en YouTube
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-cyber-green hover:bg-cyber-green/90 text-true-black font-chakra text-sm tracking-wide rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Video
        </button>
      </div>

      {/* Videos Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12 bg-panel/40 border border-border-dark rounded-xl">
          <p className="text-gray-500 mb-4">No hay videos registrados</p>
          <button
            onClick={() => openModal()}
            className="text-cyber-green hover:underline text-sm"
          >
            Agregar el primer video
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group bg-panel/40 border border-border-dark rounded-xl overflow-hidden hover:border-cyber-green/30 transition-all"
            >
              {/* YouTube Embed */}
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${video.video_id}`}
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={video.title}
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h3 className="font-chakra text-sm font-semibold text-white">
                  {video.title}
                </h3>

                <p className="text-xs text-gray-500 font-mono">
                  ID: {video.video_id}
                </p>
                {video.created_at && (
                  <p className="text-[11px] text-gray-400 font-mono">
                    Fecha: {new Date(video.created_at).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => openModal(video)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-panel/60 hover:bg-cyber-green/10 border border-border-dark hover:border-cyber-green/30 rounded text-gray-400 hover:text-cyber-green transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span className="text-xs font-chakra">Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="px-3 py-1.5 bg-panel/60 hover:bg-red-500/10 border border-border-dark hover:border-red-500/30 rounded text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-true-black border border-border-dark rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-chakra text-xl font-bold text-white">
                {editingVideo ? 'Editar Video' : 'Nuevo Video'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Fecha de creación */}
                            <div>
                              <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">
                                Fecha de creación
                              </label>
                              <input
                                type="datetime-local"
                                value={formData.created_at}
                                onChange={(e) => setFormData({ ...formData, created_at: e.target.value })}
                                className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                              />
                              <p className="text-[10px] text-gray-600 mt-1">
                                Si se deja vacío, se usará la fecha actual automáticamente.
                              </p>
                            </div>
              {/* Title */}
              <div>
                <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">
                  Título *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                  placeholder="Apalancados Spaces #1 — Trading & DeFi"
                />
              </div>

              {/* Video ID */}
              <div>
                <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">
                  Video ID *
                </label>
                <input
                  type="text"
                  required
                  value={formData.video_id}
                  onChange={(e) => setFormData({ ...formData, video_id: e.target.value })}
                  className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                  placeholder="dQw4w9WgXcQ"
                />
                <p className="text-[10px] text-gray-600 mt-1">
                  El ID después de ?v= en la URL de YouTube
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-panel/40 hover:bg-panel/60 border border-border-dark text-gray-400 hover:text-white font-chakra text-sm rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-cyber-green hover:bg-cyber-green/90 text-true-black font-chakra text-sm rounded-lg transition-colors"
                >
                  {editingVideo ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
