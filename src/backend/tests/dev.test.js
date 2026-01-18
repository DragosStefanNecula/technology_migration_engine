import test from 'node:test';
import assert from 'node:assert';

import { handleFileUpload } from '../handlers.js';
import { genJavaAstDebug, parseDebugOutput } from './testingFunctions.js';
test('parse simple JavaScript snippet', () => {
  const input = "my ($self) = @_; ";
  // console.log(parseDebugOutput(input));
  console.log(genJavaAstDebug(input));
  // console.log(handleFileUpload(input));
});