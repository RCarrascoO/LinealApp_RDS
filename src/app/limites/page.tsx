'use client';

import React, { useState } from 'react';
import { PanelTipoDiscontinuidad } from '../../components/limites/panel-tipo-discontinuidad';
import { PanelAnalisisLimites } from '../../components/limites/panel-analisis-limites';
import { TablaEvidenciaNumerica } from '../../components/limites/tabla-evidencia-numerica';
import { ModoDefensaLimites } from '../../components/limites/modo-defensa-limites';
import { EncabezadoLimites } from '../../components/limites/encabezado-limites';
import { TarjetaFuncionPorTramos } from '../../components/limites/tarjeta-funcion-por-tramos';
import { PanelEntradaLimites } from '../../components/limites/panel-entrada-limites';

export default function PaginaLimites() {
  const [mostrarAnalisis, setMostrarAnalisis] = useState(false);

  return (
    <main className="bg-background flex flex-col gap-6 p-4 sm:p-6 mx-auto w-full max-w-[1200px]">
      {/* 1. Encabezado */}
      <EncabezadoLimites />

      {/* Input de RUT para límites */}
      <PanelEntradaLimites 
        onAnalyze={() => setMostrarAnalisis(true)} 
        onClear={() => setMostrarAnalisis(false)} // <-- NUEVO: Oculta el análisis al limpiar
      />

      {mostrarAnalisis && (
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