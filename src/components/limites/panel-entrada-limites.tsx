'use client';

import { useState } from 'react';
import { RutForm } from '@/components/RutForm';

interface Props {
  onAnalyze: (rut: string, digitos: number[], v: number) => void;
  onClear: () => void;
}

export function PanelEntradaLimites({ onAnalyze, onClear }: Props) {
  const [rutValido, setRutValido] = useState('');
  const [digitos, setDigitos] = useState<number[]>([]);
  const [v, setV] = useState<number>(0);

  const handleValidated = (rut: string, digitosParams: number[], vParam: number) => {
    setRutValido(rut);
    setDigitos(digitosParams);
    setV(vParam);
  };

  return (
    <div className="w-full">
      <RutForm 
        onValidated={handleValidated} 
        onContinue={() => onAnalyze(rutValido, digitos, v)}
        onClear={onClear}
        textContinue="Ver Análisis de Límites"
      />
    </div>
  );
}