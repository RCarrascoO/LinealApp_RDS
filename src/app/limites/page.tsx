export default function LimitesPage() {
  return (
    <main className="bg-background px-4 py-6 lg:px-6">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Límites</p>
          <h2 className="mt-2 text-[24px] font-bold leading-8 text-foreground">Vista de límites</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Vista de apoyo para el estudio y revisión de comportamiento local. Mantiene el mismo lenguaje visual del resto de la aplicación.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="app-card p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Análisis</p>
            <h3 className="mt-2 text-[18px] font-semibold leading-7 text-foreground">Límite lateral izquierdo</h3>
            <div className="mt-4 rounded-[14px] border border-border bg-muted p-4">
              <p className="font-mono text-sm text-foreground">lim x→a⁻ f(x)</p>
              <p className="mt-3 text-sm text-muted-foreground">Muestra una evaluación guiada con color de advertencia y éxito según el resultado.</p>
            </div>
          </section>

          <section className="app-card p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Empty state</p>
            <h3 className="mt-2 text-[18px] font-semibold leading-7 text-foreground">Sin datos cargados</h3>
            <div className="mt-4 flex min-h-[220px] items-center justify-center rounded-[14px] border border-dashed border-border bg-muted text-sm text-muted-foreground">
              Espera a conectar la lógica de límites para mostrar el análisis completo.
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}