import test from 'node:test';
import assert from 'node:assert';

import { handleFileUpload } from '../handlers.js';
import { parseDebugOutput } from '../components/perlParser.js';
test('parse simple JavaScript snippet', () => {
  const input = "my ($self) = @_; ";
  console.log(parseDebugOutput(input));
  // console.log(handleFileUpload(input));
});