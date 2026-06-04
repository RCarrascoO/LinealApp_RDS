import React from 'react';

export function EncabezadoLimites() {
  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Análisis de Límites y Continuidad
      </h1>
      <p className="text-base text-muted-foreground md:whitespace-nowrap md:truncate">
        Evaluación del comportamiento de la función en la vecindad del punto crítico, existencia del límite y tipos de discontinuidad.
      </p>
    </section>
  );
}
