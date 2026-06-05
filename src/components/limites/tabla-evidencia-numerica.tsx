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
    <article className="flex h-full flex-col gap-4 rounded-xl border border-border bg-muted p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Icono className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">{titulo}</h4>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{descripcion}</p>
        </div>
        <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
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

  const limiteIzquierda: string = '4';
  const limiteDerecha: string = '7';
  const existeLimite = limiteIzquierda === limiteDerecha;

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

      <div className="overflow-hidden rounded-xl border border-border bg-muted">
        <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-3">
          <ArrowRight className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Conclusión textual</span>
        </div>
        <div className="grid gap-3 px-4 py-4 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-card px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Valor por izquierda</p>
            <p className="mt-1 text-sm text-foreground">
              La función se aproxima a <span className="font-mono font-semibold text-primary">{limiteIzquierda}</span> cuando x se acerca a a por la izquierda.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Valor por derecha</p>
            <p className="mt-1 text-sm text-foreground">
              La función se aproxima a <span className="font-mono font-semibold text-primary">{limiteDerecha}</span> cuando x se acerca a a por la derecha.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Conclusión de existencia</p>
            <p className={`mt-1 text-sm font-medium ${existeLimite ? 'text-success' : 'text-destructive'}`}>
              {existeLimite
                ? `El límite general existe porque ambos límites laterales coinciden en ${limiteIzquierda}.`
                : `El límite general no existe porque los límites laterales son diferentes (${limiteIzquierda} ≠ ${limiteDerecha}).`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}