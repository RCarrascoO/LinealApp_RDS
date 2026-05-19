export type ValidacionRutResult = { valido: boolean; pasos: string[]; v: number };

export function validarRUT(rut: string): ValidacionRutResult {
  const pasos: string[] = [];
  const rutLimpio = rut.replace(/[^0-9kK]/g, "").toUpperCase();

  if (rutLimpio.length < 2) {
    return { valido: false, pasos: ["RUT demasiado corto para analizar."], v: 0 };
  }

  const cuerpoSinPadding = rutLimpio.slice(0, -1);
  const dvIngresado = rutLimpio.slice(-1);

  if (!/^\d+$/.test(cuerpoSinPadding)) {
    return { valido: false, pasos: ["El cuerpo del RUT debe contener solo dígitos."], v: 0 };
  }

  if (cuerpoSinPadding.length > 8) {
    return { valido: false, pasos: ["El cuerpo del RUT no puede superar 8 dígitos."], v: 0 };
  }

  const cuerpo = cuerpoSinPadding.padStart(8, "0");
  const digitos = cuerpo.split("").map((d) => Number(d));
  const multiplicadores = [2, 3, 4, 5, 6, 7, 2, 3];
  let sumaTotal = 0;

  pasos.push(`RUT procesado: ${cuerpo}-${dvIngresado}`);
  pasos.push(`Serie usada (derecha a izquierda): [2, 3, 4, 5, 6, 7, 2, 3]`);

  for (let i = 7; i >= 0; i--) {
    const digito = digitos[i];
    const multiplicador = multiplicadores[7 - i];
    const producto = digito * multiplicador;
    sumaTotal += producto;
    pasos.push(`${digito} × ${multiplicador} = ${producto}`);
  }

  pasos.push(`Suma total: ${sumaTotal}`);
  const residuo = sumaTotal % 11;
  pasos.push(`Residuo de ${sumaTotal} / 11 = ${residuo}`);

  const onceMenosResiduo = 11 - residuo;
  let dvEsperado = "";

  if (onceMenosResiduo === 11) {
    dvEsperado = "0";
  } else if (onceMenosResiduo === 10) {
    dvEsperado = "K";
  } else {
    dvEsperado = String(onceMenosResiduo);
  }

  pasos.push(`11 - ${residuo} = ${onceMenosResiduo} → DV esperado: ${dvEsperado}`);

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
