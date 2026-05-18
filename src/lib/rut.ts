export function validarRUT(rut: string): { valido: boolean; pasos: string[]; v: number } {
  const pasos: string[] = [];
  
  // Limpiar y preparar el texto
  // Quitamos puntos y guiones. Solo dejamos números y la letra K (mayúscula).
  const rutLimpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  
  // Si quedó muy corto, no es un RUT válido
  if (rutLimpio.length < 2) {
    return { valido: false, pasos: ["RUT demasiado corto para analizar."], v: 0 };
  }

  // Separamos el número (cuerpo) del dígito verificador (DV)
  const cuerpo = rutLimpio.slice(0, -1);
  const dvIngresado = rutLimpio.slice(-1);
  
  pasos.push(`RUT procesado: ${cuerpo}-${dvIngresado}`);

  // Multiplicar y sumar la serie de multiplicadores (2, 3, 4, 5, 6, 7) aplicados a cada dígito del cuerpo
  let sumaTotal = 0;
  let serie = 2;
  
  // Recorremos los números del cuerpo de derecha a izquierda (desde el final hacia el principio)
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    const numeroActual = parseInt(cuerpo[i], 10);
    const resultadoMultiplicacion = numeroActual * serie;
    
    sumaTotal += resultadoMultiplicacion;
    pasos.push(`${numeroActual} × ${serie} = ${resultadoMultiplicacion}`);
    
    // La serie sube de 1 en 1. Si llega a 7, vuelve a caer a 2.
    if (serie === 7) {
      serie = 2;
    } else {
      serie = serie + 1;
    }
  }
  
  pasos.push(`Suma total: ${sumaTotal}`);
  
  // Matemáticas del Módulo 11 
  // Calculamos el residuo o "resto" de dividir la suma total entre 11
  const residuo = sumaTotal % 11;
  pasos.push(`Residuo de ${sumaTotal} / 11 = ${residuo}`);
  
  // Restamos 11 menos el residuo obtenido
  const restaFinal = 11 - residuo;
  
  // Determinar el DV esperado 
  let dvEsperado = restaFinal.toString();
  
  // Reglas especiales del algoritmo Módulo 11:
  if (restaFinal === 11) {
    dvEsperado = '0';
  } else if (restaFinal === 10) {
    dvEsperado = 'K';
  }
  
  pasos.push(`11 - ${residuo} = ${restaFinal} → DV esperado: ${dvEsperado}`);
  
  // Resultado final
  // Comparamos el DV que ingresó el usuario con el que calculamos nosotros
  const esValido = dvIngresado === dvEsperado;
  
  if (esValido) {
    pasos.push(`DV ingresado: ${dvIngresado} (Coincide, RUT válido)`);
  } else {
    pasos.push(`DV ingresado: ${dvIngresado} (No coincide, RUT inválido)`);
  }
  
  // Asignar el valor de la variable 'v' según el DV esperado
  let v = 0;
  if (dvEsperado === 'K') {
    v = 10;
  } else if (dvEsperado === '0') {
    v = 11;
  } else {
    v = parseInt(dvEsperado, 10);
  }

  return { valido: esValido, pasos: pasos, v: v };
}
