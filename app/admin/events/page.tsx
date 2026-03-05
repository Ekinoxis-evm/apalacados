'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Calendar, X as XIcon } from 'lucide-react'

type Event = {
  id: string
  event_id: string
  embed_src: string
  display_order: number
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  
  const [formData, setFormData] = useState({
    event_id: '',
    embed_src: '',
  })

  const supabase = createClient()

  const loadEvents = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('luma_events')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (!error && data) {
      setEvents(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingEvent) {
      const { error } = await supabase
        .from('luma_events')
        .update(formData)
        .eq('id', editingEvent.id)
      
      if (!error) {
        await loadEvents()
        closeModal()
      }
    } else {
      const { error } = await supabase
        .from('luma_events')
        .insert([formData])
      
      if (!error) {
        await loadEvents()
        closeModal()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este evento?')) return
    
    const { error } = await supabase
      .from('luma_events')
      .delete()
      .eq('id', id)
    
    if (!error) {
      await loadEvents()
    }
  }

  const openModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event)
      setFormData({
        event_id: event.event_id,
        embed_src: event.embed_src,
      })
    } else {
      setEditingEvent(null)
      setFormData({
        event_id: '',
        embed_src: '',
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingEvent(null)
    setFormData({
      event_id: '',
      embed_src: '',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-chakra text-2xl font-bold text-white mb-1">
            Gestionar Eventos
          </h1>
          <p className="font-outfit text-sm text-gray-500">
            Próximos eventos en Luma
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-cyber-green hover:bg-cyber-green/90 text-true-black font-chakra text-sm tracking-wide rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Evento
        </button>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 bg-panel/40 border border-border-dark rounded-xl">
          <p className="text-gray-500 mb-4">No hay eventos registrados</p>
          <button
            onClick={() => openModal()}
            className="text-cyber-green hover:underline text-sm"
          >
            Agregar el primer evento
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="group bg-panel/40 border border-border-dark rounded-xl overflow-hidden hover:border-cyber-green/30 transition-all"
            >
              {/* Luma Embed */}
              <div className="h-px bg-gradient-to-r from-transparent via-cyber-green/30 to-transparent" />
              <iframe
                src={event.embed_src}
                width="100%"
                height="450"
                frameBorder="0"
                style={{ display: 'block' }}
                allow="fullscreen; payment"
                aria-hidden={false}
                tabIndex={0}
                title="Evento en Luma"
              />

              {/* Content */}
              <div className="p-4 space-y-3 border-t border-border-dark">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyber-green" />
                  <p className="text-xs text-gray-500 font-mono">
                    {event.event_id}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal(event)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-panel/60 hover:bg-cyber-green/10 border border-border-dark hover:border-cyber-green/30 rounded text-gray-400 hover:text-cyber-green transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span className="text-xs font-chakra">Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
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
                {editingEvent ? 'Editar Evento' : 'Nuevo Evento'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Event ID */}
              <div>
                <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">
                  Event ID *
                </label>
                <input
                  type="text"
                  required
                  value={formData.event_id}
                  onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                  className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                  placeholder="evt-XXXXXXXXXX"
                />
                <p className="text-[10px] text-gray-600 mt-1">
                  Ejemplo: evt-nQWrxvuPyqZVZVf
                </p>
              </div>

              {/* Embed URL */}
              <div>
                <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">
                  Embed URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.embed_src}
                  onChange={(e) => setFormData({ ...formData, embed_src: e.target.value })}
                  className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                  placeholder="https://luma.com/embed/event/evt-XXXXXXXXXX/simple"
                />
                <p className="text-[10px] text-gray-600 mt-1">
                  URL del iframe embed de Luma
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
                  {editingEvent ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
