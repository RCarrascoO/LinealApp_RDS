'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { label: 'Validación de Rut', href: '/rut', mark: 'R' },
  { label: 'Secciones Cónicas', href: '/conicas', mark: 'C' },
  { label: 'Límites', href: '/limites', mark: 'L' }
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
      <div className="border-b border-border p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(37,99,235,0.18)]">
            <span className="text-lg font-bold">M</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">MathRUT</p>
            <p className="text-sm text-muted-foreground">Cálculo I</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Vistas
        </p>
        {items.map((item) => {
          const activo = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center justify-between overflow-hidden rounded-[10px] px-3 py-3 text-sm font-medium transition-all ${
                activo
                  ? 'bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(37,99,235,0.18)]'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-primary shadow-sm">
                  {item.mark}
                </span>
                <span>{item.label}</span>
              </div>
              
              {/* Indicador visual a la derecha (solo visible si está activo) */}
              {activo && (
                <span className="absolute right-3 h-2 w-2 rounded-full bg-white shadow-sm" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-[14px] bg-muted p-4 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Proyecto académico</p>
          <p className="mt-1">Validación, cónicas y límites en un mismo flujo.</p>
        </div>
      </div>
    </aside>
  );
}