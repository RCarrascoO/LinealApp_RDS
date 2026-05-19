export type ValidacionRutResult = { valido: boolean; pasos: string[]; v: number };

export function validarRUT(rut: string): ValidacionRutResult {
  const pasos: string[] = [];
  const rutLimpio = rut.replace(/[^0-9kK]/g, "").toUpperCase();

  if (rutLimpio.length < 2) {
    return { valido: false, pasos: ["RUT demasiado corto para analizar."], v: 0 };
  }

  const cuerpoSinNormalizar = rutLimpio.slice(0, -1);
  const dvIngresado = rutLimpio.slice(-1);

  if (!/^\d+$/.test(cuerpoSinNormalizar)) {
    return { valido: false, pasos: ["El cuerpo del RUT debe contener solo dígitos."], v: 0 };
  }

  if (cuerpoSinNormalizar.length > 8) {
    return { valido: false, pasos: ["El cuerpo del RUT no puede superar 8 dígitos."], v: 0 };
  }

  // El cuerpo del RUT chileno puede tener hasta 8 dígitos; para aplicar una serie
  // fija en Módulo 11 lo normalizamos a 8 posiciones con ceros a la izquierda.
  const cuerpo = cuerpoSinNormalizar.padStart(8, "0");
  const digitos = cuerpo.split("").map((d) => Number(d));
  // Multiplicadores Módulo 11 aplicados de derecha a izquierda sobre 8 posiciones.
  const multiplicadores = [2, 3, 4, 5, 6, 7, 2, 3];
  let sumaTotal = 0;

  pasos.push(`RUT procesado: ${cuerpo}-${dvIngresado}`);
  pasos.push(`Serie usada (derecha a izquierda): [2, 3, 4, 5, 6, 7, 2, 3]`);

  for (let i = 7; i >= 0; i--) {
    const digito = digitos[i];
    // Invertimos índice: posición 7 usa multiplicadores[0]=2, posición 0 usa [7]=3.
    const multiplicador = multiplicadores[7 - i];
    const producto = digito * multiplicador;
    sumaTotal += producto;
    pasos.push(`${digito} × ${multiplicador} = ${producto}`);
  }

  pasos.push(`Suma total: ${sumaTotal}`);
  const residuo = sumaTotal % 11;
  pasos.push(`Residuo de ${sumaTotal} / 11 = ${residuo}`);

  const dvNumerico = 11 - residuo;
  let dvEsperado = "";

  if (dvNumerico === 11) {
    dvEsperado = "0";
  } else if (dvNumerico === 10) {
    dvEsperado = "K";
  } else {
    dvEsperado = String(dvNumerico);
  }

  pasos.push(`11 - ${residuo} = ${dvNumerico} → DV esperado: ${dvEsperado}`);

  const valido = dvEsperado === dvIngresado;
  pasos.push(
    valido
      ? `DV ingresado: ${dvIngresado} (Coincide, RUT válido)`
      : `DV ingresado: ${dvIngresado} (No coincide, RUT inválido)`
  );

  const v = dvEsperado === "K" ? 10 : dvEsperado === "0" ? 11 : Number(dvEsperado);
  pasos.push(`Valor auxiliar v: ${v}`);

  return { valido, pasos, v };
}
