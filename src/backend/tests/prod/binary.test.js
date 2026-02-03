import test from 'node:test';
import assert from 'node:assert';

import { parsePerl } from '../../components/perlParser.js';
import { handlePerl } from '../../components/migrationLogic.js';

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
4 || 2;`;
assert(handlePerl(input) === 
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
4 || 2;`);
});

test('Multi Layered Binary + Ternary', () => {

const input = 
`$a == $b || $c == $d && $e != $f;
($x + $y) * $z;
($x + $y) > $z ? $x * $z : $y * $z
`;
assert(handlePerl(input) === 
`a == b || c == d && e != f;
(x + y) * z;
(x + y) > z ? x * z : y * z;`);
});

test('String Binary', () => {

const input = 
`$a eq $b;
$a ne $b
`;
assert(handlePerl(input) === 
`a.equals(b);
!a.equals(b);`);
});

