'use client';

interface Props {
  pasosCoeficientes?: string[];
}

export function PanelProcedimientoMatematico({ pasosCoeficientes = [] }: Props) {
  const pasos = [
    {
      title: 'Extracción de Dígitos',
      content: pasosCoeficientes[0] ?? 'Normaliza el RUT, separa los 8 dígitos del cuerpo y guarda el DV para evaluar v.'
    },
    { title: 'Coeficientes base', content: pasosCoeficientes[1] ?? 'Calcula A, B, C, D y E únicamente con operaciones nativas de JS/TS.' },
    { title: 'Ajustes secuenciales', content: pasosCoeficientes[2] ?? 'Aplica las reglas sobre d8, d1, d5, d6 y d7 en el orden indicado.' },
    { title: 'Clasificación de la cónica', content: pasosCoeficientes[pasosCoeficientes.length - 1] ?? 'Clasifica por igualdad, ceros o signos opuestos de A y B.' },
    { title: 'Forma general final', content: 'La ecuación queda estrictamente como Ax² + By² + Cx + Dy + E = 0.', finalFormula: 'Ax² + By² + Cx + Dy + E = 0' },
    { title: 'Verificación manual', content: 'Comprueba que cada ajuste secuencial muta A o B sin introducir términos cruzados.' }
  ];

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">PROCEDIMIENTO MATEMÁTICO</p>
        <h2 className="text-xl font-bold text-foreground">Derivación paso a paso</h2>
        <p className="mt-1 text-sm text-muted-foreground">Pasos matemáticos detallados para transformar y verificar la cónica.</p>
      </div>

      <div className="space-y-3">
        {pasos.map((paso, idx) => (
          <details key={idx} className="group rounded-xl border border-border bg-muted p-4">
            <summary className="cursor-pointer list-none flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{idx + 1}</span>
                <span className="text-sm font-semibold text-foreground">{paso.title}</span>
              </div>
              <span className="text-xs text-muted-foreground">Paso {idx + 1}</span>
            </summary>

            <div className="mt-3 space-y-3">
              <p className="text-sm leading-6 text-muted-foreground">{paso.content}</p>
              {paso.finalFormula && (
                <div className="rounded-md border border-border bg-card p-3">
                  <pre className="m-0 font-mono text-sm text-foreground">{paso.finalFormula}</pre>
                </div>
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}