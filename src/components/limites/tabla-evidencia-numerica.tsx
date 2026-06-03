import React from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, LucideIcon } from 'lucide-react';

type EvidenciaItem = {
  x: string;
  fx: string;
  observacion: string;
};

type BloqueEvidenciaProps = {
  titulo: string;
  descripcion: string;
  icono: LucideIcon;
  items: EvidenciaItem[];
  tendencia: string;
};

function BloqueEvidencia({ titulo, descripcion, icono: Icono, items, tendencia }: BloqueEvidenciaProps) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-xl border border-border bg-muted/30 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Icono className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">{titulo}</h4>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{descripcion}</p>
        </div>
        <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          {tendencia}
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-muted/70 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">x</th>
              <th className="px-3 py-2 font-medium">f(x)</th>
              <th className="px-3 py-2 font-medium">Evidencia</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={`${titulo}-${item.x}`} className="border-t border-border/70">
                <td className="px-3 py-2 font-mono text-xs text-foreground">{item.x}</td>
                <td className="px-3 py-2 font-mono text-xs text-foreground">{item.fx}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{item.observacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

export function TablaEvidenciaNumerica() {
  const evidenciaIzquierda: EvidenciaItem[] = [
    { x: 'a - 0.30', fx: '4.40', observacion: 'Se acerca al valor límite desde arriba.' },
    { x: 'a - 0.10', fx: '4.18', observacion: 'La secuencia desciende de forma estable.' },
    { x: 'a - 0.01', fx: '4.02', observacion: 'El valor se estabiliza en torno a 4.' },
  ];

  const evidenciaDerecha: EvidenciaItem[] = [
    { x: 'a + 0.30', fx: '6.60', observacion: 'Se aproxima al valor esperado desde abajo.' },
    { x: 'a + 0.10', fx: '6.82', observacion: 'La secuencia mantiene una tendencia ascendente.' },
    { x: 'a + 0.01', fx: '6.98', observacion: 'La evidencia numérica converge a 7.' },
  ];

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-foreground">Tabla de Evidencia Numérica</h3>
        <p className="text-sm text-muted-foreground">
          Comparación de aproximaciones laterales para respaldar la conclusión del límite.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BloqueEvidencia
          titulo="Aproximación por izquierda"
          descripcion="Valores tomados cuando x se acerca a a por valores menores."
          icono={ChevronLeft}
          items={evidenciaIzquierda}
          tendencia="→ 4"
        />

        <BloqueEvidencia
          titulo="Aproximación por derecha"
          descripcion="Valores tomados cuando x se acerca a a por valores mayores."
          icono={ChevronRight}
          items={evidenciaDerecha}
          tendencia="→ 7"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
        <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-3">
          <ArrowRight className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Fila final de resumen</span>
        </div>
        <div className="grid gap-3 px-4 py-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div className="rounded-lg border border-border bg-card px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Izquierda</p>
            <p className="mt-1 font-mono text-sm font-semibold text-primary">4.02 → 4</p>
          </div>
          <div className="flex justify-center text-2xl font-semibold text-primary">→</div>
          <div className="rounded-lg border border-border bg-card px-4 py-3 text-right md:text-left">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Derecha</p>
            <p className="mt-1 font-mono text-sm font-semibold text-primary">6.98 → 7</p>
          </div>
        </div>
      </div>
    </section>
  );
}