'use client';

import React, { useState, useEffect } from 'react';
import { PenSquare, ShieldCheck, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLimitesContext } from './LimitesContext';

type FormState = {
  limIzq: string;
  limDer: string;
  existeLimite: string;
  tipoDisc: string;
  justificacion: string;
};

type ValidationErrors = {
  limIzq?: string;
  limDer?: string;
  existeLimite?: string;
  tipoDisc?: string;
  justificacion?: string;
};

function getExpectedValues(resultado: NonNullable<ReturnType<typeof useLimitesContext>['resultado']>): FormState {
  return {
    limIzq: resultado.limIzquierda.toString(),
    limDer: resultado.limDerecha.toString(),
    existeLimite: resultado.existeLimite ? 'si' : 'no',
    tipoDisc: resultado.tipoDiscontinuidad,
    justificacion: resultado.justificacion,
  };
}

export function ModoDefensaLimites() {
  const { resultado } = useLimitesContext();

  const [form, setForm] = useState<FormState>({
    limIzq: '',
    limDer: '',
    existeLimite: 'no',
    tipoDisc: 'salto',
    justificacion: '',
  });

  const [validated, setValidated] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // No autocompletar en un nuevo análisis, comenzar vacío para el modo defensa
  useEffect(() => {
    if (resultado) {
      setForm({
        limIzq: '',
        limDer: '',
        existeLimite: 'no',
        tipoDisc: 'salto',
        justificacion: '',
      });
      setValidated(false);
      setAllCorrect(false);
      setErrors({});
    }
  }, [resultado]);

  const handleChange = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    // Limpiar error al editar
    if (validated) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleValidate = () => {
    if (!resultado) return;

    const expected = getExpectedValues(resultado);
    const newErrors: ValidationErrors = {};

    // Comparación numérica con tolerancia para decimales
    const limIzqMatch = Math.abs(parseFloat(form.limIzq) - parseFloat(expected.limIzq)) < 0.0001;
    const limDerMatch = Math.abs(parseFloat(form.limDer) - parseFloat(expected.limDer)) < 0.0001;

    if (!limIzqMatch) newErrors.limIzq = `Valor correcto: ${expected.limIzq}`;
    if (!limDerMatch) newErrors.limDer = `Valor correcto: ${expected.limDer}`;
    if (form.existeLimite !== expected.existeLimite)
      newErrors.existeLimite = `Respuesta correcta: ${expected.existeLimite === 'si' ? 'Sí, existe' : 'No existe'}`;
    if (form.tipoDisc !== expected.tipoDisc)
      newErrors.tipoDisc = `Tipo correcto: ${expected.tipoDisc}`;

    const noErrors = Object.keys(newErrors).length === 0;
    setErrors(newErrors);
    setValidated(true);
    setAllCorrect(noErrors);
  };

  const handleRestore = () => {
    if (resultado) {
      setForm(getExpectedValues(resultado));
      setValidated(false);
      setAllCorrect(false);
      setErrors({});
    }
  };

  const fieldClass = (field: keyof ValidationErrors) =>
    `rounded-md border bg-card px-3 py-2 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-primary/20 ${
      validated && errors[field]
        ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
        : 'border-border focus:border-primary'
    }`;

  return (
    <section className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Modo Defensa de Límites</h3>
        </div>
        <span className="inline-flex w-fit items-center rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
          Formulario listo para exposición oral
        </span>
      </div>

      <p className="text-sm text-muted-foreground">
        {resultado
          ? 'Los campos están vacíos para que los llenes en tu defensa oral. Complétalos y usa "Preparar defensa" para verificar.'
          : 'Completa los datos clave para explicar el análisis del límite con claridad durante la defensa.'}
      </p>

      {/* Success / Error banner after validation */}
      {validated && (
        <div
          className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium ${
            allCorrect
              ? 'border-success/30 bg-success/10 text-success'
              : 'border-destructive/30 bg-destructive/10 text-destructive'
          }`}
        >
          {allCorrect ? (
            <>
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              ✅ ¡Respuestas correctas! Estás listo para la defensa.
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 shrink-0" />
              Hay campos incorrectos. Revisa los mensajes en rojo y corrige.
            </>
          )}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Límite izquierdo */}
        <label className="flex flex-col gap-2 rounded-lg border border-border bg-muted p-4">
          <span className="text-sm font-medium text-foreground">Límite izquierdo</span>
          <input
            type="text"
            value={form.limIzq}
            onChange={handleChange('limIzq')}
            className={fieldClass('limIzq')}
            aria-label="Límite izquierdo"
          />
          {validated && errors.limIzq && (
            <span className="text-xs font-medium text-destructive">{errors.limIzq}</span>
          )}
        </label>

        {/* Límite derecho */}
        <label className="flex flex-col gap-2 rounded-lg border border-border bg-muted p-4">
          <span className="text-sm font-medium text-foreground">Límite derecho</span>
          <input
            type="text"
            value={form.limDer}
            onChange={handleChange('limDer')}
            className={fieldClass('limDer')}
            aria-label="Límite derecho"
          />
          {validated && errors.limDer && (
            <span className="text-xs font-medium text-destructive">{errors.limDer}</span>
          )}
        </label>

        {/* ¿Existe el límite? */}
        <label className="flex flex-col gap-2 rounded-lg border border-border bg-muted p-4 lg:col-span-2">
          <span className="text-sm font-medium text-foreground">¿Existe el límite?</span>
          <select
            value={form.existeLimite}
            onChange={handleChange('existeLimite')}
            className={fieldClass('existeLimite')}
            aria-label="¿Existe el límite?"
          >
            <option value="si">Sí, existe</option>
            <option value="no">No existe</option>
            <option value="parcial">Aún requiere verificación</option>
          </select>
          {validated && errors.existeLimite && (
            <span className="text-xs font-medium text-destructive">{errors.existeLimite}</span>
          )}
        </label>

        {/* Tipo de discontinuidad */}
        <label className="flex flex-col gap-2 rounded-lg border border-border bg-muted p-4 lg:col-span-2">
          <span className="text-sm font-medium text-foreground">Tipo de discontinuidad</span>
          <select
            value={form.tipoDisc}
            onChange={handleChange('tipoDisc')}
            className={fieldClass('tipoDisc')}
            aria-label="Tipo de discontinuidad"
          >
            <option value="continua">Función continua (sin discontinuidad)</option>
            <option value="removible">Evitable / removible</option>
            <option value="salto">De salto</option>
            <option value="infinita">Infinita / asintótica</option>
          </select>
          {validated && errors.tipoDisc && (
            <span className="text-xs font-medium text-destructive">{errors.tipoDisc}</span>
          )}
        </label>

        {/* Justificación */}
        <label className="flex flex-col gap-2 rounded-lg border border-border bg-muted p-4 lg:col-span-2">
          <span className="text-sm font-medium text-foreground">Justificación escrita</span>
          <textarea
            rows={4}
            value={form.justificacion}
            onChange={handleChange('justificacion')}
            className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            aria-label="Justificación escrita"
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">Acción de defensa</p>
          <p className="text-xs text-muted-foreground">
            Verifica tus respuestas o restaura los valores calculados.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {resultado && (
            <button
              type="button"
              onClick={handleRestore}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              <RotateCcw className="h-4 w-4" />
              Restaurar valores calculados
            </button>
          )}

          <button
            type="button"
            onClick={handleValidate}
            disabled={!resultado}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <PenSquare className="h-4 w-4" />
            Preparar defensa
          </button>
        </div>
      </div>
    </section>
  );
}