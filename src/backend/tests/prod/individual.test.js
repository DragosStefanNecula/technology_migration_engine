import test from 'node:test';
import assert from 'node:assert';

import { parsePerl } from '../../components/perlParser.js';
import { handlePerl } from '../../components/migrationLogic.js';

test('IntegerLiteral', () => {

  const input = `
    42;
  `;

  assert(handlePerl(input) === "42;");
});

test('StringLiteral', () => {

  const input = `
    "42";
  `;

  assert(handlePerl(input) === '"42";');
});

test('ScalarVariable/Identifier', () => {

  const input = `
    $42;
  `;

  assert(handlePerl(input) === "42");
});


test('ControlFlowCommand', () => {

  const input = `
    {
      last;
      next;
      return;
    }
  `;

  assert(handlePerl(input) === `{
  break;
  continue;
  return;
}`);
});

test('Return', () => {

  const input = `
    {
      return $a
    }
  `;

  assert(handlePerl(input) === `{
  return a;
}`);
});