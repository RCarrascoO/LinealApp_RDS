import { validarRUT } from "./rut";
import assert from "node:assert/strict";
import test from "node:test";

type RutCase = {
  nombre: string;
  rut: string;
  validoEsperado: boolean;
  vEsperado: number;
};

const casos: RutCase[] = [
  {
    nombre: "RUT válido estándar",
    rut: "12.345.678-5",
    validoEsperado: true,
    vEsperado: 5,
  },
  {
    nombre: "RUT inválido por DV incorrecto",
    rut: "12.345.678-9",
    validoEsperado: false,
    vEsperado: 5,
  },
  {
    nombre: "Borde DV K",
    rut: "6-K",
    validoEsperado: true,
    vEsperado: 10,
  },
  {
    nombre: "Borde DV 0",
    rut: "14-0",
    validoEsperado: true,
    vEsperado: 11,
  },
  {
    nombre: "RUT inválido por formato vacío/corto",
    rut: "-",
    validoEsperado: false,
    vEsperado: 0,
  },
];

test("validarRUT cubre casos válidos, inválidos y bordes DV 0/K", () => {
  for (const caso of casos) {
    const resultado = validarRUT(caso.rut);
    assert.equal(
      resultado.valido,
      caso.validoEsperado,
      `[${caso.nombre}] válido esperado=${caso.validoEsperado}, recibido=${resultado.valido}`
    );
    assert.equal(
      resultado.v,
      caso.vEsperado,
      `[${caso.nombre}] v esperado=${caso.vEsperado}, recibido=${resultado.v}`
    );
  }
});
