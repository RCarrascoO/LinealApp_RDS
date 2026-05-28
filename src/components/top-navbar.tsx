'use client';

import { useState, useEffect } from 'react';
import { PanelLeft, Users, ChevronDown, Sun, Moon } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import { useTheme } from 'next-themes';

export function TopNavbar() {
  const [teamOpen, setTeamOpen] = useState(false);
  const { toggleSidebar, isSidebarCollapsed } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-border bg-card px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button 
          type="button" 
          onClick={toggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted text-muted-foreground transition-colors"
          aria-label={isSidebarCollapsed ? "Mostrar menú lateral" : "Ocultar menú lateral"}
          title={isSidebarCollapsed ? "Mostrar menú lateral" : "Ocultar menú lateral"}
        >
          <PanelLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">MathRUT</span>
          <span className="hidden text-sm text-muted-foreground sm:inline-block">
            Validacion de Rut, Secciones Conicas y Limites
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Team Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setTeamOpen(!teamOpen)}
            onBlur={() => setTimeout(() => setTeamOpen(false), 200)}
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline-block">Team</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          
          {teamOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md border border-border bg-card p-1 shadow-lg">
              <div className="px-2 py-1.5 text-sm text-foreground hover:bg-muted rounded-sm cursor-default">
                1) Renato Carrasco
              </div>
              <div className="px-2 py-1.5 text-sm text-foreground hover:bg-muted rounded-sm cursor-default">
                2) Daniel Prado
              </div>
              <div className="px-2 py-1.5 text-sm text-foreground hover:bg-muted rounded-sm cursor-default">
                3) Sebastian Pereda
              </div>
            </div>
          )}
        </div>

        {/* Github Link */}
        <a
          href="https://github.com/RCarrascoO/LinealApp_RDS"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="GitHub Repository"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
        </a>

        {/* Theme Toggle */}
        {mounted && (
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        )}
      </div>
    </header>
  );
}