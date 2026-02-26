import test from 'node:test';
import assert from 'node:assert';
import { genJavaAstDebug } from '../testingFunctions.js';

test('GenNode', () => {
  const input = `do {} while()`;

let node = genJavaAstDebug(input).body[0];

assert(node.type === 'GenNode');
assert(node.prompt === 'This is a mock system prompt.This is some extra information');
assert(node.content === 'do {} while()');
});