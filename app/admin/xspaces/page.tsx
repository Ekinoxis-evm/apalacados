'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, ExternalLink, X as XIcon, Upload } from 'lucide-react'
import Image from 'next/image'

type XSpace = {
  id: string
  title: string
  image_url: string
  space_url: string
  display_order: number
  created_at?: string
}

export default function XSpacesPage() {
  const [spaces, setSpaces] = useState<XSpace[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSpace, setEditingSpace] = useState<XSpace | null>(null)
  const [uploading, setUploading] = useState(false)
  
  const [formData, setFormData] = useState<{
    title: string
    image_url: string
    space_url: string
    created_at?: string
  }>({
    title: '',
    image_url: '',
    space_url: '',
    created_at: '',
  })

  const supabase = createClient()

  const loadSpaces = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('x_spaces')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (!error && data) {
      setSpaces(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadSpaces()
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `xspaces/${fileName}`

    const { error: uploadError, data } = await supabase.storage
      .from('images')
      .upload(filePath, file)

    if (uploadError) {
      alert('Error subiendo imagen: ' + uploadError.message)
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)
      
      setFormData({ ...formData, image_url: publicUrl })
    }
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { ...formData }
    if (!payload.created_at) delete payload.created_at
    if (editingSpace) {
      const { error } = await supabase
        .from('x_spaces')
        .update(payload)
        .eq('id', editingSpace.id)
      if (!error) {
        await loadSpaces()
        closeModal()
      }
    } else {
      const { error } = await supabase
        .from('x_spaces')
        .insert([payload])
      if (!error) {
        await loadSpaces()
        closeModal()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este X Space?')) return
    
    const { error } = await supabase
      .from('x_spaces')
      .delete()
      .eq('id', id)
    
    if (!error) {
      await loadSpaces()
    }
  }

  const openModal = (space?: XSpace) => {
    if (space) {
      setEditingSpace(space)
      setFormData({
        title: space.title,
        image_url: space.image_url,
        space_url: space.space_url,
        created_at: space.created_at ? space.created_at.slice(0, 16) : '',
      })
    } else {
      setEditingSpace(null)
      setFormData({
        title: '',
        image_url: '',
        space_url: '',
        created_at: '',
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingSpace(null)
    setFormData({
      title: '',
      image_url: '',
      space_url: '',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-chakra text-2xl font-bold text-white mb-1">
            Gestionar X Spaces
          </h1>
          <p className="font-outfit text-sm text-gray-500">
            Grabaciones de espacios en vivo
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-cyber-green hover:bg-cyber-green/90 text-true-black font-chakra text-sm tracking-wide rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo X Space
        </button>
      </div>

      {/* Spaces Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : spaces.length === 0 ? (
        <div className="text-center py-12 bg-panel/40 border border-border-dark rounded-xl">
          <p className="text-gray-500 mb-4">No hay X Spaces registrados</p>
          <button
            onClick={() => openModal()}
            className="text-cyber-green hover:underline text-sm"
          >
            Agregar el primer X Space
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {spaces.map((space) => (
            <div
              key={space.id}
              className="group bg-panel/40 border border-border-dark rounded-xl overflow-hidden hover:border-cyber-green/30 transition-all"
            >
              {/* Image */}
              <div className="relative w-full h-48">
                <Image
                  src={space.image_url}
                  alt={space.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h3 className="font-chakra text-sm font-semibold text-white">
                  {space.title}
                </h3>

                <a
                  href={space.space_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-gray-400 hover:text-cyber-green transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Ver Space
                </a>
                {space.created_at && (
                  <p className="text-[11px] text-gray-400 font-mono">
                    Fecha: {new Date(space.created_at).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => openModal(space)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-panel/60 hover:bg-cyber-green/10 border border-border-dark hover:border-cyber-green/30 rounded text-gray-400 hover:text-cyber-green transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span className="text-xs font-chakra">Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(space.id)}
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
                {editingSpace ? 'Editar X Space' : 'Nuevo X Space'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Apalancados X Space #1"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">
                  Imagen *
                </label>
                {formData.image_url ? (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border-dark mb-2">
                    <Image
                      src={formData.image_url}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image_url: '' })}
                      className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded text-white"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="block w-full px-4 py-8 border-2 border-dashed border-border-dark hover:border-cyber-green/30 rounded-lg cursor-pointer transition-colors">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-6 h-6 text-gray-500" />
                      <span className="text-xs text-gray-500">
                        {uploading ? 'Subiendo...' : 'Click para subir imagen'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                )}
                <p className="text-[10px] text-gray-600 mt-1">
                  PNG o JPG, imagen de los chapters del space
                </p>
              </div>

              {/* Space URL */}
              <div>
                <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">
                  URL del Space *
                </label>
                <input
                  type="url"
                  required
                  value={formData.space_url}
                  onChange={(e) => setFormData({ ...formData, space_url: e.target.value })}
                  className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                  placeholder="https://x.com/i/spaces/..."
                />
              </div>

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
                  disabled={uploading || !formData.image_url}
                  className="flex-1 px-4 py-2 bg-cyber-green hover:bg-cyber-green/90 text-true-black font-chakra text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingSpace ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
