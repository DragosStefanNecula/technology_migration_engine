import test from 'node:test';
import assert from 'node:assert';

import { handlePerlDebug } from '#src/backend/tests/testingFunctions.js';

test('Simple Binary Operators + Urnary', () => {

const input = `
$a++;
$b--;
4 + 2;
4 - 2;
4 * 2;
4 / 2;
4 % 2;
4 == 2;
4 != 2;
4 < 2;
4 <= 2;
4 > 2;
4 >= 2;
4 && 2;
4 = 2;
4 || 2;
$a ** $b;
!$a;`;
assert(handlePerlDebug(input) === 
`a++;
b--;
4 + 2;
4 - 2;
4 * 2;
4 / 2;
4 % 2;
4 == 2;
4 != 2;
4 < 2;
4 <= 2;
4 > 2;
4 >= 2;
4 && 2;
4 = 2;
4 || 2;
Math.pow(a, b);
!a;`);
});

test('Multi Layered Binary + Ternary', () => {

const input = 
`$a == $b || $c == $d && $e != $f;
($x + $y) * $z;
($x + $y) > $z ? $x * $z : $y * $z
`;
assert(handlePerlDebug(input) === 
`a == b || c == d && e != f;
(x + y) * z;
(x + y) > z ? x * z : y * z;`);
});

test('String Binary', () => {

const input = 
`$a eq $b;
$a ne $b
`;
assert(handlePerlDebug(input) === 
`a.equals(b);
!a.equals(b);`);
});

