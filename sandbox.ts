import { clasificarConica } from './src/lib/clasificarConica';

console.log('--- TEST SANDBOX: clasificarConica ---');

const test1 = clasificarConica(1, 1, 0, 0, -4); 
console.log('Test 1 (Circunferencia A=1, B=1):', test1.tipo, '->', test1.razon);

const test2 = clasificarConica(2, 3, 0, 0, -6);
console.log('Test 2 (Elipse A=2, B=3):', test2.tipo, '->', test2.razon);

const test3 = clasificarConica(1, -1, 0, 0, -4);
console.log('Test 3 (Hipérbola A=1, B=-1):', test3.tipo, '->', test3.razon);

const test4 = clasificarConica(1, 0, -4, 0, 0);
console.log('Test 4 (Parábola A=1, B=0):', test4.tipo, '->', test4.razon);
