export type ValidacionRutResult = { 
  valido: boolean; 
  pasos: string[]; 
  v: number;
  detalles?: {
    cuerpo: string;
    dvIngresado: string;
    digitos: number[];
    multiplicadores: number[];
    productos: number[];
    sumaTotal: number;
    residuo: number;
    dvEsperado: string;
  }
};

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
  // fija en Modulo 11 lo normalizamos a 8 posiciones con ceros a la izquierda.
  const cuerpo = cuerpoSinNormalizar.padStart(8, "0");
  const digitos = cuerpo.split("").map((d) => Number(d));
  // Multiplicadores Modulo 11 aplicados de derecha a izquierda sobre 8 posiciones.
  // [2, 3, 4, 5, 6, 7, 2, 3] en orden invertido (de d8 a d1)
  const multiplicadoresArray = [3, 2, 7, 6, 5, 4, 3, 2]; // Ojo: pos 7 usa 2, pos 6 usa 3, pos 5 usa 4... wait.
  // wait, the original logic:
  // for (let i = 7; i >= 0; i--) { multiplicador = multiplicadores[7 - i] }
  // if multiplicadores = [2, 3, 4, 5, 6, 7, 2, 3], then:
  // i=7 -> mult[0]=2
  // i=6 -> mult[1]=3
  // i=5 -> mult[2]=4
  // i=4 -> mult[3]=5
  // i=3 -> mult[4]=6
  // i=2 -> mult[5]=7
  // i=1 -> mult[6]=2
  // i=0 -> mult[7]=3
  
  const multiplicadoresList = [3, 2, 7, 6, 5, 4, 3, 2]; // Este es el multiplicador para pos 0 a 7
  let sumaTotal = 0;
  const productos: number[] = [];

  pasos.push(`RUT procesado: ${cuerpo}-${dvIngresado}`);
  pasos.push(`Serie usada (derecha a izquierda): [2, 3, 4, 5, 6, 7, 2, 3]`);

  for (let i = 0; i < 8; i++) {
    const digito = digitos[i];
    const multiplicador = multiplicadoresList[i];
    const producto = digito * multiplicador;
    productos.push(producto);
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

  return { 
    valido, 
    pasos, 
    v, 
    detalles: {
      cuerpo,
      dvIngresado,
      digitos,
      multiplicadores: multiplicadoresList,
      productos,
      sumaTotal,
      residuo,
      dvEsperado
    }
  };
}