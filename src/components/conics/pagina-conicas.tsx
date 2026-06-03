'use client';

import { useState } from 'react';
import { PanelGraficaConicas } from './panel-grafica-conicas';
import { PanelEntradaConicas } from './panel-entrada-conicas';
import { PanelResultadosConicas } from './panel-resultados-conicas';
import { PanelProcedimientoMatematico } from './panel-procedimiento-matematico';
import { calcularCoeficientes } from '@/lib/calcularCoeficientes';
import { clasificarConica, CoeficientesConica, ConicaResult } from '@/lib/clasificarConica';

export type EstadoFlujo = 'esperando' | 'calculando' | 'clasificando' | 'listo';

const demora = (milisegundos: number) => new Promise((resolver) => setTimeout(resolver, milisegundos));

export function PaginaConicas() {
  const [resultado, setResultado] = useState<ConicaResult | null>(null);
  const [coeficientes, setCoeficientes] = useState<CoeficientesConica | null>(null);
  const [pasosCoeficientes, setPasosCoeficientes] = useState<string[]>([]);
  const [estadoFlujo, setEstadoFlujo] = useState<EstadoFlujo>('esperando');
  const [digitosRut, setDigitosRut] = useState<number[]>([]);

  const manejarValidated = async (rut: string) => {
    setEstadoFlujo('calculando');
    setResultado(null);
    setCoeficientes(null);
    setPasosCoeficientes([]);
    await demora(200);

    const generado = calcularCoeficientes(rut);
    setDigitosRut([...generado.digitos, generado.v]);
    setCoeficientes(generado.coeficientes);
    setPasosCoeficientes(generado.pasos);

    setEstadoFlujo('clasificando');
    await demora(200);

    const analisis = clasificarConica(
      generado.coeficientes.A,
      generado.coeficientes.B,
      generado.coeficientes.C,
      generado.coeficientes.D,
      generado.coeficientes.E
    );

    setResultado(analisis);
    setEstadoFlujo('listo');
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur">
          <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                Análisis de Cónicas
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
                Genera y analiza secciones cónicas a partir de la extracción de coeficientes del RUT
              </p>
            </div>
          </div>
        </header>

        {/* Grid principal de 2 columnas (input/results) - Tarea 2.1 */}
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Columna Izquierda: Persona 2 */}
          <div className="space-y-6">
            <PanelEntradaConicas 
              estadoFlujo={estadoFlujo}
              onAnalyze={manejarValidated}
              coeficientes={coeficientes}
              resultado={resultado}
              digitos={digitosRut}
            />
          </div>

          {/* Columna Derecha: Persona 3 */}
          <div className="space-y-6">
            {resultado && coeficientes && (
              <PanelResultadosConicas
                resultado={resultado}
                coeficientes={coeficientes}
                pasosCoeficientes={pasosCoeficientes}
              />
            )}
            
            <PanelGraficaConicas resultado={resultado} />
          </div>
        </div>
        
        {/* Debajo: panel matemático completo - Tarea 2.1 (Hecho por persona 3) */}
        <div className="space-y-6">
            <PanelProcedimientoMatematico pasosCoeficientes={pasosCoeficientes} />
        </div>

      </div>
    </main>
  );
}
