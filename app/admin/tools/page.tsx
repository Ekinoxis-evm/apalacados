'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, ExternalLink, X as XIcon } from 'lucide-react'
import Image from 'next/image'

type Tool = {
  id: string
  name: string
  logo: string
  website: string
  x_url: string | null
  topic: string
  display_order: number
}

const topics = [
  { value: 'trading', label: 'Trading & Perps', color: '#00ff41' },
  { value: 'prediction', label: 'Prediction Markets', color: '#00d4ff' },
  { value: 'defi', label: 'DeFi', color: '#00fff0' },
  { value: 'memes', label: 'Memes & NFTs', color: '#bc13fe' },
  { value: 'ai', label: 'Inteligencia Artificial', color: '#ff006e' },
  { value: 'tradfi', label: 'Traditional Finance', color: '#f59e0b' },
]

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTool, setEditingTool] = useState<Tool | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<string>('all')
  
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    website: '',
    x_url: '',
    topic: 'trading',
  })

  const supabase = createClient()

  const loadTools = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (!error && data) {
      setTools(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadTools()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingTool) {
      // Update
      const { error } = await supabase
        .from('tools')
        .update(formData)
        .eq('id', editingTool.id)
      
      if (!error) {
        await loadTools()
        closeModal()
      }
    } else {
      // Create
      const { error } = await supabase
        .from('tools')
        .insert([formData])
      
      if (!error) {
        await loadTools()
        closeModal()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta herramienta?')) return
    
    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', id)
    
    if (!error) {
      await loadTools()
    }
  }

  const openModal = (tool?: Tool) => {
    if (tool) {
      setEditingTool(tool)
      setFormData({
        name: tool.name,
        logo: tool.logo,
        website: tool.website,
        x_url: tool.x_url || '',
        topic: tool.topic,
      })
    } else {
      setEditingTool(null)
      setFormData({
        name: '',
        logo: '',
        website: '',
        x_url: '',
        topic: 'trading',
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingTool(null)
    setFormData({
      name: '',
      logo: '',
      website: '',
      x_url: '',
      topic: 'trading',
    })
  }

  const filteredTools = selectedTopic === 'all' 
    ? tools 
    : tools.filter(t => t.topic === selectedTopic)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-chakra text-2xl font-bold text-white mb-1">
            Gestionar Herramientas
          </h1>
          <p className="font-outfit text-sm text-gray-500">
            Apps y proyectos que usamos en cada tema
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-cyber-green hover:bg-cyber-green/90 text-true-black font-chakra text-sm tracking-wide rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Herramienta
        </button>
      </div>

      {/* Topic Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedTopic('all')}
          className={`px-4 py-2 rounded-lg font-chakra text-xs tracking-wide transition-colors flex-shrink-0 ${
            selectedTopic === 'all'
              ? 'bg-cyber-green/10 text-cyber-green border border-cyber-green/30'
              : 'bg-panel/40 text-gray-400 border border-border-dark hover:text-white'
          }`}
        >
          Todos ({tools.length})
        </button>
        {topics.map((topic) => (
          <button
            key={topic.value}
            onClick={() => setSelectedTopic(topic.value)}
            className={`px-4 py-2 rounded-lg font-chakra text-xs tracking-wide transition-colors flex-shrink-0 ${
              selectedTopic === topic.value
                ? 'border'
                : 'bg-panel/40 text-gray-400 border border-border-dark hover:text-white'
            }`}
            style={
              selectedTopic === topic.value
                ? { backgroundColor: `${topic.color}10`, color: topic.color, borderColor: `${topic.color}30` }
                : {}
            }
          >
            {topic.label} ({tools.filter(t => t.topic === topic.value).length})
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">
          Cargando...
        </div>
      ) : filteredTools.length === 0 ? (
        <div className="text-center py-12 bg-panel/40 border border-border-dark rounded-xl">
          <p className="text-gray-500 mb-4">No hay herramientas registradas</p>
          <button
            onClick={() => openModal()}
            className="text-cyber-green hover:underline text-sm"
          >
            Agregar la primera herramienta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool) => {
            const topicInfo = topics.find(t => t.value === tool.topic)
            return (
              <div
                key={tool.id}
                className="group bg-panel/40 border border-border-dark rounded-xl p-4 hover:border-cyber-green/30 transition-all"
              >
                {/* Logo */}
                <div className="relative w-16 h-16 rounded-full overflow-hidden border border-border-dark bg-true-black mx-auto mb-3">
                  <Image
                    src={tool.logo}
                    alt={tool.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Name */}
                <h3 className="font-chakra text-sm font-semibold text-white text-center mb-2">
                  {tool.name}
                </h3>

                {/* Topic Badge */}
                <div className="flex justify-center mb-3">
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-chakra tracking-wide border"
                    style={{
                      backgroundColor: `${topicInfo?.color}10`,
                      color: topicInfo?.color,
                      borderColor: `${topicInfo?.color}30`,
                    }}
                  >
                    {topicInfo?.label}
                  </span>
                </div>

                {/* Links */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded bg-panel/60 border border-border-dark hover:border-cyber-green/40 transition-colors"
                    title="Website"
                  >
                    <ExternalLink className="w-3 h-3 text-gray-500 hover:text-cyber-green transition-colors" />
                  </a>
                  {tool.x_url && (
                    <a
                      href={tool.x_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded bg-panel/60 border border-border-dark hover:border-cyber-green/40 transition-colors"
                      title="X / Twitter"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-gray-500 hover:text-cyber-green transition-colors">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal(tool)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-panel/60 hover:bg-cyber-green/10 border border-border-dark hover:border-cyber-green/30 rounded text-gray-400 hover:text-cyber-green transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span className="text-xs font-chakra">Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(tool.id)}
                    className="px-3 py-1.5 bg-panel/60 hover:bg-red-500/10 border border-border-dark hover:border-red-500/30 rounded text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-true-black border border-border-dark rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-chakra text-xl font-bold text-white">
                {editingTool ? 'Editar Herramienta' : 'Nueva Herramienta'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                  placeholder="Hyperliquid"
                />
              </div>

              {/* Logo URL */}
              <div>
                <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">
                  Logo URL (desde X/Twitter) *
                </label>
                <input
                  type="url"
                  required
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                  placeholder="https://pbs.twimg.com/profile_images/..."
                />
                <p className="text-[10px] text-gray-600 mt-1">
                  Click derecho en el logo de X → Copiar dirección de imagen
                </p>
              </div>

              {/* Website */}
              <div>
                <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">
                  Website *
                </label>
                <input
                  type="url"
                  required
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                  placeholder="https://hyperliquid.xyz"
                />
              </div>

              {/* X URL */}
              <div>
                <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">
                  X / Twitter (opcional)
                </label>
                <input
                  type="url"
                  value={formData.x_url}
                  onChange={(e) => setFormData({ ...formData, x_url: e.target.value })}
                  className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                  placeholder="https://twitter.com/HyperliquidX"
                />
              </div>

              {/* Topic */}
              <div>
                <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">
                  Tema *
                </label>
                <select
                  required
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                >
                  {topics.map((topic) => (
                    <option key={topic.value} value={topic.value}>
                      {topic.label}
                    </option>
                  ))}
                </select>
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
                  {editingTool ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
