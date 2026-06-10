'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { ResultadoLimites } from '@/lib/limites';

interface LimitesContextType {
  resultado: ResultadoLimites | null;
  setResultado: (r: ResultadoLimites | null) => void;
  rutIngresado: string;
  setRutIngresado: (rut: string) => void;
}

const LimitesContext = createContext<LimitesContextType | undefined>(undefined);

export function LimitesProvider({ children }: { children: ReactNode }) {
  const [resultado, setResultado] = useState<ResultadoLimites | null>(null);
  const [rutIngresado, setRutIngresado] = useState('');

  return (
    <LimitesContext.Provider value={{ resultado, setResultado, rutIngresado, setRutIngresado }}>
      {children}
    </LimitesContext.Provider>
  );
}

export function useLimitesContext() {
  const context = useContext(LimitesContext);
  if (context === undefined) {
    throw new Error('useLimitesContext must be used within a LimitesProvider');
  }
  return context;
}
