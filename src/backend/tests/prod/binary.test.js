import test from 'node:test';
import assert from 'node:assert';

import { parsePerl } from '../../components/perlParser.js';
import { handlePerl } from '../../components/migrationLogic.js';

test('Simple Binary Operators', () => {

const input = `
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
`4 + 2;
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
