'use client'

import Link from 'next/link'

export default function LiveHubLanding() {
  return (
    <div className="min-h-screen grid-bg flex flex-col items-center justify-center py-20">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <h1 className="font-chakra text-3xl font-bold text-white tracking-wider mb-2">
          LIVE <span className="text-cyber-green">HUB</span>
        </h1>
        <p className="text-gray-400 mb-8">Elige una plataforma para ver las transmisiones en vivo y grabaciones:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/live-hub/kick" className="block bg-panel/60 border border-border-dark rounded-xl p-8 hover:border-cyber-green transition-all">
            <span className="font-chakra text-lg text-cyber-green">KICK</span>
            <div className="mt-2 text-xs text-gray-500">Transmisiones en vivo en Kick.com</div>
          </Link>
          <Link href="/live-hub/x" className="block bg-panel/60 border border-border-dark rounded-xl p-8 hover:border-white transition-all">
            <span className="font-chakra text-lg text-white">X SPACES</span>
            <div className="mt-2 text-xs text-gray-500">Grabaciones y Spaces en X</div>
          </Link>
          <Link href="/live-hub/youtube" className="block bg-panel/60 border border-border-dark rounded-xl p-8 hover:border-[#ff4444] transition-all">
            <span className="font-chakra text-lg" style={{ color: '#ff4444' }}>YOUTUBE</span>
            <div className="mt-2 text-xs text-gray-500">Grabaciones en YouTube</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
