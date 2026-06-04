'use client';

import { useState } from 'react';
import { RutForm } from '@/components/RutForm';

interface Props {
  onAnalyze: (rut: string) => void;
  onClear: () => void; // <-- NUEVO
}

export function PanelEntradaLimites({ onAnalyze, onClear }: Props) {
  const [rutValido, setRutValido] = useState('');

  const handleValidated = (rut: string) => {
    setRutValido(rut);
  };

  return (
    <div className="w-full">
      <RutForm 
        onValidated={handleValidated} 
        onContinue={() => onAnalyze(rutValido)}
        onClear={onClear} // <-- Le pasamos la prop al RutForm
        textContinue="Ver Análisis de Límites"
      />
    </div>
  );
}