'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarContextType {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };
    
    // Configuración inicial basada en la pantalla
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ isSidebarCollapsed, toggleSidebar }}>
      {/* Previene problemas de hidratación evitando renderizados condicionales drásticos hasta montar */}
      <div className={isMounted ? "contents" : "contents opacity-0 lg:opacity-100"}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
