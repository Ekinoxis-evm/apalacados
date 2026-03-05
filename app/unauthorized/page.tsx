import Link from 'next/link'
import { ShieldX } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen grid-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <ShieldX className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="font-chakra text-2xl font-bold text-white tracking-wider mb-2">
            ACCESO <span className="text-red-500">DENEGADO</span>
          </h1>
          <p className="font-outfit text-sm text-gray-400 mb-4">
            Tu cuenta no tiene permisos para acceder al panel de administración.
          </p>
          <p className="font-outfit text-xs text-gray-600">
            Solo usuarios autorizados pueden acceder a esta sección.
            Si crees que esto es un error, contacta al administrador.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full px-6 py-3 bg-cyber-green hover:bg-cyber-green/90 text-true-black font-chakra text-sm tracking-wide rounded-lg transition-colors"
          >
            Volver al Inicio
          </Link>
          <Link
            href="/login"
            className="w-full px-6 py-3 bg-panel/40 hover:bg-panel/60 border border-border-dark text-gray-400 hover:text-white font-chakra text-sm tracking-wide rounded-lg transition-colors"
          >
            Iniciar Sesión con Otra Cuenta
          </Link>
        </div>
      </div>
    </div>
  )
}
