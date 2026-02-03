import test from 'node:test';
import assert from 'node:assert';

import { genJavaAstDebug, parseDebugOutput } from './testingFunctions.js';
import { handlePerl } from '../components/migrationLogic.js';
test('parse simple JavaScript snippet', () => {
const input = `
  $a = $a + $b;
`;
    
  console.log(parseDebugOutput(input));
  // console.log(genJavaAstDebug(input).body[0].params);
  // genJavaAstDebug(input);
  console.log(handlePerl(input));
});