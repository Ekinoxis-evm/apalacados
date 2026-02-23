import { Calendar } from 'lucide-react'

/*
  ── Events configuration ────────────────────────────────────────────────────
  Add your Luma events here. For each event:
  1. Go to your event on lu.ma
  2. Click "Embed" → copy the iframe src URL
  3. Add a new object to the array below

  Current event embed provided in luma.md:
  src: https://luma.com/embed/event/evt-nQWrxvuPyqZVZVf/simple
  ────────────────────────────────────────────────────────────────────────────
*/
const events = [
  {
    id: 'evt-nQWrxvuPyqZVZVf',
    embedSrc: 'https://luma.com/embed/event/evt-nQWrxvuPyqZVZVf/simple',
  },
  // Add more events here:
  // {
  //   id: 'evt-XXXXXXXXXX',
  //   embedSrc: 'https://luma.com/embed/event/evt-XXXXXXXXXX/simple',
  // },
]

function EventCard({ embedSrc }: { embedSrc: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-border-dark bg-panel/40 neon-border transition-all duration-300">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-cyber-green/30 to-transparent" />

      {/* Luma iframe */}
      <iframe
        src={embedSrc}
        width="100%"
        height="450"
        frameBorder="0"
        style={{ display: 'block' }}
        allow="fullscreen; payment"
        aria-hidden={false}
        tabIndex={0}
        title="Evento en Luma"
      />
    </div>
  )
}

export default function EventsPage() {
  return (
    <div className="min-h-screen grid-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">

        {/* ── Page header ── */}
        <div className="mb-8">
          <p className="section-label mb-2">AGENDA</p>
          <h1 className="font-chakra text-3xl sm:text-4xl font-bold text-white mb-3">
            PRÓXIMOS{' '}
            <span className="text-cyber-green glow-green">ESPACIOS</span>{' '}
            EN VIVO
          </h1>
          <p className="font-outfit text-sm text-gray-500 max-w-lg leading-relaxed">
            Regístrate a los próximos eventos, sincroniza con tu calendario y no te pierdas
            ningún espacio en vivo.
          </p>
        </div>

        {/* ── Section label ── */}
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-4 h-4 text-cyber-green" />
          <h2 className="font-chakra text-sm font-semibold text-white tracking-[0.15em]">
            EVENTOS REGISTRADOS
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-border-dark to-transparent" />
          <span className="section-label">{events.length} EVENTO{events.length !== 1 ? 'S' : ''}</span>
        </div>

        {/* ── Event cards grid ── */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {events.map((event) => (
              <EventCard key={event.id} embedSrc={event.embedSrc} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4 rounded-xl border border-border-dark bg-panel/30">
            <Calendar className="w-10 h-10 text-cyber-green/20" />
            <p
              className="text-xs tracking-widest text-gray-600 uppercase"
              style={{ fontFamily: 'var(--font-dm-mono)' }}
            >
              NO HAY EVENTOS PROGRAMADOS
            </p>
            <p className="font-outfit text-xs text-gray-700">
              Agrega eventos en <code className="text-cyber-green/60">app/events/page.tsx</code>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
