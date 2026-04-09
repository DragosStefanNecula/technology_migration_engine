import test from 'node:test';
import assert from 'node:assert';
import { genJavaAstDebug } from '#src/backend/tests/testingFunctions.js';

test('GenNode', () => {
  const input = `do {} while()`;

let node = genJavaAstDebug(input).body[0];

assert(node.type === 'GenNode');
assert(node.content === 'do {} while()');
});

test('MethodInvocation', () => {
  const input = `$obj->method($arg, $arg2);`;

let node = genJavaAstDebug(input).body[0];
console.log(node)

assert(node.type === 'MethodInvocation');
assert(node.content === '$obj->method($arg, $arg2)');
});