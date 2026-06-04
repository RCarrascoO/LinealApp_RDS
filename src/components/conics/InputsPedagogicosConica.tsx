import React, { useState } from 'react';
import { ConicaResult } from '@/lib/clasificarConica';

interface Props {
  resultado: ConicaResult;
}

export function InputsPedagogicosConica({ resultado }: Props) {
  const [valores, setValores] = useState<Record<string, string>>({});

  const handleChange = (campo: string, valor: string) => {
    setValores(prev => ({ ...prev, [campo]: valor }));
  };

  const InputField = ({ label, campo }: { label: string, campo: string }) => {
    const value = valores[campo] || '';
    const isCompleted = value.trim().length > 0;
    
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        <div className="relative flex items-center">
          <input 
            type="text" 
            placeholder="Ej: (0,0)"
            className="w-full rounded-md border border-border bg-muted/50 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary"
            value={value}
            onChange={(e) => handleChange(campo, e.target.value)}
          />
          {isCompleted && (
            <div className="absolute right-3 h-2 w-2 rounded-full bg-primary" title="Completado" />
          )}
        </div>
      </div>
    );
  };

  const camposPorTipo = () => {
    switch (resultado.tipo) {
      case 'circunferencia':
      case 'elipse':
        return [
          { label: 'Centro', campo: 'centro' },
          { label: 'Vértice Superior', campo: 'v_sup' },
          { label: 'Vértice Inferior', campo: 'v_inf' },
          { label: 'Vértice Izquierdo', campo: 'v_izq' },
          { label: 'Vértice Derecho', campo: 'v_der' },
          { label: 'Foco 1', campo: 'f1' },
          { label: 'Foco 2', campo: 'f2' },
        ];
      case 'hiperbola':
        return [
          { label: 'Centro', campo: 'centro' },
          { label: 'Vértices', campo: 'vertices' },
          { label: 'Focos', campo: 'focos' },
          { label: 'Asíntotas', campo: 'asintotas' },
        ];
      case 'parabola':
        return [
          { label: 'Vértice', campo: 'vertice' },
          { label: 'Foco', campo: 'foco' },
          { label: 'Directriz', campo: 'directriz' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="mt-6 rounded-xl border border-border bg-card/50 p-4">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Entradas Manuales (Respuesta)</h3>
      <div className="grid grid-cols-2 gap-4">
        {camposPorTipo().map((c) => (
          <InputField key={c.campo} label={c.label} campo={c.campo} />
        ))}
      </div>
    </div>
  );
}
