'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from './SidebarContext';

const items = [
  { label: 'Secciones Cónicas', href: '/conicas', mark: 'C' },
  { label: 'Límites', href: '/limites', mark: 'L' }
];

export function AppSidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed } = useSidebar();

  return (
    <aside 
      className={`hidden shrink-0 border-r border-border bg-card transition-all duration-300 lg:flex lg:flex-col ${
        isSidebarCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      <div className={`border-b border-border p-6 ${isSidebarCollapsed ? 'flex justify-center px-0' : ''}`}>
        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="flex shrink-0 h-11 w-11 items-center justify-center rounded-[14px] bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(37,99,235,0.18)]">
            <span className="text-lg font-bold">M</span>
          </div>
          {!isSidebarCollapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <p className="text-sm font-semibold text-foreground">MathRUT</p>
              <p className="text-sm text-muted-foreground">Cálculo I</p>
            </div>
          )}
        </div>
      </div>

      <nav className={`flex-1 space-y-2 p-4 ${isSidebarCollapsed ? 'px-2' : ''}`}>
        {!isSidebarCollapsed && (
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap overflow-hidden">
            Vistas
          </p>
        )}
        {items.map((item) => {
          const activo = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isSidebarCollapsed ? item.label : undefined}
              className={`relative flex items-center overflow-hidden rounded-[10px] py-3 font-medium transition-all ${
                activo
                  ? 'bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(37,99,235,0.18)]'
                  : 'text-foreground hover:bg-muted'
              } ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-3 text-sm'}`}
            >
              <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 overflow-hidden'}`}>
                <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-primary shadow-sm">
                  {item.mark}
                </span>
                {!isSidebarCollapsed && (
                  <span className="whitespace-nowrap">{item.label}</span>
                )}
              </div>
              
              {/* Indicador visual a la derecha (solo visible si está activo y no colapsado) */}
              {activo && !isSidebarCollapsed && (
                <span className="absolute right-3 h-2 w-2 shrink-0 rounded-full bg-white shadow-sm" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className={`border-t border-border ${isSidebarCollapsed ? 'p-2' : 'p-4'}`}>
        {!isSidebarCollapsed ? (
          <div className="rounded-[14px] bg-muted p-4 text-sm text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
            <p className="font-semibold text-foreground">Proyecto académico</p>
            <p className="mt-1 whitespace-normal break-words">Validación, cónicas y límites en un mismo flujo.</p>
          </div>
        ) : (
          <div className="flex justify-center py-2" title="Proyecto Académico MAT-2024">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground font-bold text-xs">
              U
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}