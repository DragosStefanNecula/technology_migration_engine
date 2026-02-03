import test from 'node:test';
import assert from 'node:assert';

import { parsePerl } from '../../components/perlParser.js';
import { handlePerl } from '../../migrationLogic.js';

test('IntegerLiteral', () => {

  const input = `
    42;
  `;

  assert(handlePerl(input) === "42;");
});