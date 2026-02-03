import test from 'node:test';

import { genJavaAstDebug, parseDebugOutput } from './testingFunctions.js';
import { handlePerl } from '../components/migrationLogic.js';

test('Dev', () => {
  const input = `
    $a = $a > $b;
  `;
    
  console.log(parseDebugOutput(input));
  console.log(genJavaAstDebug(input));
  console.log(handlePerl(input));
});