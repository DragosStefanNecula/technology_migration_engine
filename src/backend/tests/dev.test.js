import test from 'node:test';

import { genJavaAstDebug, parseDebugOutput } from './testingFunctions.js';
import { handlePerlDebug } from './testingFunctions.js';

test('Dev', () => {
  const input = `
    {
do {} while()}`;
    
  console.log(parseDebugOutput(input));
  console.log(JSON.stringify(genJavaAstDebug(input), null, 2));
  console.log(handlePerlDebug(input));
});