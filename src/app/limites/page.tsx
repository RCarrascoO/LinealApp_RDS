import type { Metadata } from 'next';
import PaginaLimitesCliente from './PaginaLimitesCliente';

export const metadata: Metadata = {
  title: 'Análisis de Límites y Continuidad',
  description: 'Exploración interactiva de límites laterales y continuidad de funciones por tramos - Cálculo I',
};

export default function PaginaLimites() {
  return <PaginaLimitesCliente />;
}