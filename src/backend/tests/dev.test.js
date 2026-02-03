import test from 'node:test';

import { genJavaAstDebug, parseDebugOutput } from './testingFunctions.js';
import { handlePerl } from '../components/migrationLogic.js';

test('Dev', () => {
  const input = `
    ($x + $y) * $z
  `;
    
  console.log(parseDebugOutput(input));
  console.log(JSON.stringify(genJavaAstDebug(input), null, 2));
  console.log(handlePerl(input));
});