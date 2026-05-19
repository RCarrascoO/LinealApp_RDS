'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const titulos: Record<string, { titulo: string; subtitulo: string }> = {
  '/': { titulo: 'Validación RUT', subtitulo: 'Inicio del flujo académico' },
  '/conicas': { titulo: 'Sección Cónicas', subtitulo: 'Análisis completo y defensa oral' },
  '/limites': { titulo: 'Límites', subtitulo: 'Vista de apoyo para el estudio' }
};

const enlaces = [
  { href: '/', label: 'RUT', mark: 'R' },
  { href: '/conicas', label: 'Cónicas', mark: 'C' },
  { href: '/limites', label: 'Límites', mark: 'L' }
] as const;

export function TopNavbar() {
  const pathname = usePathname();
  const contenido = titulos[pathname] ?? titulos['/'];

  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between gap-4 px-4 py-4 lg:px-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            MathRUT
          </p>
          <h1 className="text-[24px] font-bold leading-8 text-foreground">{contenido.titulo}</h1>
          <p className="text-sm text-muted-foreground">{contenido.subtitulo}</p>
        </div>
      </div>

      <nav className="border-t border-border px-4 py-3 lg:hidden">
        <div className="grid grid-cols-3 gap-2">
          {enlaces.map((enlace) => {
            const activo = pathname === enlace.href;

            return (
              <Link
                key={enlace.href}
                href={enlace.href}
                className={`flex items-center justify-center gap-2 rounded-[10px] px-3 py-2 text-xs font-semibold transition-colors ${
                  activo
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-primary">
                  {enlace.mark}
                </span>
                <span>{enlace.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}