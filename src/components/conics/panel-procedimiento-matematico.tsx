'use client';

interface Props {
  pasosCoeficientes?: string[];
}

export function PanelProcedimientoMatematico({ pasosCoeficientes = [] }: Props) {
  const pasos = [
    {
      title: 'Extracción de Coeficientes',
      content: pasosCoeficientes[0] ?? 'Extrae los dígitos y calcula A, B, C, D, E según las reglas de mapeo.'
    },
    { title: 'Clasificación de la cónica', content: 'Usa determinantes y signos de coeficientes para clasificar como circunferencia, elipse, hipérbola o parábola.' },
    { title: 'Completar el cuadrado (términos en x)', content: 'Agrupa los términos en x y completa el cuadrado: Ax² + Dx → A(x - h)² + constante.' },
    { title: 'Completar el cuadrado (términos en y)', content: 'Agrupa los términos en y y completa el cuadrado: By² + Ey → B(y - k)² + constante.' },
    { title: 'Derivación de la forma canónica', content: 'Divide para aislar 1 y obtener la forma canónica. Fórmula final resaltada abajo.' , finalFormula: '(x - h)²/a² + (y - k)²/b² = 1' },
    { title: 'Verificación de la transformación inversa', content: 'Expande la forma canónica de nuevo a la forma general y compara coeficientes para verificar.' }
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