import test from 'node:test';
import assert from 'node:assert';

import { parse } from '../components/parser.js';
test('parse simple JavaScript snippet', () => {
  console.log(parse("sub greet :Path('greet') :Args(1)"))
});