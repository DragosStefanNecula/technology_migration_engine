import test from 'node:test';
import assert from 'node:assert';

import { parsePerl } from '../components/perlParser.js';
test('parse simple JavaScript snippet', () => {
  console.log(parsePerl("sub greet :Path('greet') :Args(1)"))
});