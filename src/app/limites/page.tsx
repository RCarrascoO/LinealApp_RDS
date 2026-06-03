import React from 'react';
import { PanelTipoDiscontinuidad } from '../../components/limites/panel-tipo-discontinuidad';
import { PanelAnalisisLimites } from '../../components/limites/panel-analisis-limites';
import { TablaEvidenciaNumerica } from '../../components/limites/tabla-evidencia-numerica';
import { ModoDefensaLimites } from '../../components/limites/modo-defensa-limites';

export default function PaginaLimites() {
  return (
    <main className="bg-background flex flex-col gap-6 p-6 mx-auto w-full max-w-[1200px]">
      {/* 1. Encabezado (Persona 1 placeholder) */}
      <section className="rounded-xl border border-dashed border-border bg-muted/30 p-6 flex flex-col items-center justify-center min-h-[100px]">
        <p className="text-center text-sm font-medium text-muted-foreground">
          [Placeholder] EncabezadoLimites (Persona 1)
        </p>
      </section>

      {/* 2. Función por tramos (Persona 1 placeholder) */}
      <section className="rounded-xl border border-dashed border-border bg-muted/30 p-6 flex flex-col items-center justify-center min-h-[100px]">
        <p className="text-center text-sm font-medium text-muted-foreground">
          [Placeholder] TarjetaFuncionPorTramos (Persona 1)
        </p>
      </section>

      {/* 3. Grilla 2 columnas (Persona 2) */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PanelTipoDiscontinuidad />
        <PanelAnalisisLimites />
      </div>

      {/* 4. Tabla numérica (Persona 3 placeholder) */}
      <TablaEvidenciaNumerica />

      {/* 5. Modo defensa (Persona 3) */}
      <ModoDefensaLimites />
    </main>
  );
}