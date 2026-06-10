'use client';

import React, { useState } from 'react';
import { PanelTipoDiscontinuidad } from '../../components/limites/panel-tipo-discontinuidad';
import { PanelAnalisisLimites } from '../../components/limites/panel-analisis-limites';
import { TablaEvidenciaNumerica } from '../../components/limites/tabla-evidencia-numerica';
import { ModoDefensaLimites } from '../../components/limites/modo-defensa-limites';
import { EncabezadoLimites } from '../../components/limites/encabezado-limites';
import { TarjetaFuncionPorTramos } from '../../components/limites/tarjeta-funcion-por-tramos';
import { PanelEntradaLimites } from '../../components/limites/panel-entrada-limites';
import { LimitesProvider, useLimitesContext } from '../../components/limites/LimitesContext';
import { calcularLimites } from '../../lib/limites';

function PaginaLimitesContenido() {
  const { resultado, setResultado, setRutIngresado } = useLimitesContext();
  const [mostrarAnalisis, setMostrarAnalisis] = useState(false);

  const handleAnalyze = (rut: string, digitos: number[], v: number) => {
    const calc = calcularLimites(digitos, v);
    setResultado(calc);
    setRutIngresado(rut);
    setMostrarAnalisis(true);
  };

  const handleClear = () => {
    setResultado(null);
    setRutIngresado('');
    setMostrarAnalisis(false);
  };

  return (
    <main className="bg-background flex flex-col gap-6 p-4 sm:p-6 mx-auto w-full max-w-[1200px]">
      {/* 1. Encabezado */}
      <EncabezadoLimites />

      {/* Input de RUT para límites */}
      <PanelEntradaLimites 
        onAnalyze={handleAnalyze} 
        onClear={handleClear}
      />

      {mostrarAnalisis && resultado && (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* 2. Función por tramos */}
          <TarjetaFuncionPorTramos />

          {/* 3. Grilla 2 columnas (Persona 2) */}
          <div className="grid gap-6 lg:grid-cols-2">
            <PanelTipoDiscontinuidad />
            <PanelAnalisisLimites />
          </div>

          {/* 4. Tabla numérica (Persona 3 placeholder) */}
          <TablaEvidenciaNumerica />

          {/* 5. Modo defensa (Persona 3) */}
          <ModoDefensaLimites />
        </div>
      )}
    </main>
  );
}

export default function PaginaLimites() {
  return (
    <LimitesProvider>
      <PaginaLimitesContenido />
    </LimitesProvider>
  );
}