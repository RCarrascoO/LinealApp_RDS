import React from 'react';

export function TarjetaFuncionPorTramos() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-row items-center justify-between p-4 sm:p-6 pb-2 sm:pb-4">
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          Función a analizar
        </h3>
        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary font-mono transition-colors">
          x = 2
        </span>
      </div>

      {/* Mathematical Block */}
      <div className="p-4 sm:p-6 pt-0 flex justify-center w-full">
        <div className="flex items-center text-sm sm:text-base md:text-lg font-mono bg-muted/40 p-4 sm:p-6 rounded-lg w-full max-w-2xl justify-center overflow-x-auto border border-border/50">
          <div className="whitespace-nowrap mr-2 sm:mr-4 font-semibold">f(x) =</div>
          <div className="text-4xl sm:text-5xl md:text-6xl font-light leading-none mr-2 sm:mr-4 text-muted-foreground">
            {'{'}
          </div>
          <div className="flex flex-col gap-2 sm:gap-3 whitespace-nowrap">
            <div>
              x² - 4 <span className="text-muted-foreground ml-2 sm:ml-4">, si x &lt; 2</span>
            </div>
            <div>
              2x + 1 <span className="text-muted-foreground ml-2 sm:ml-4">, si x ≥ 2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="bg-muted/50 p-3 sm:p-4 border-t border-border px-4 sm:px-6 flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Punto crítico en evaluación:</span>
        <span className="text-sm font-bold font-mono text-foreground">x = 2</span>
      </div>
    </div>
  );
}
