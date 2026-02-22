import test from 'node:test';
import assert from 'node:assert';
import { genJavaAstDebug } from '../testingFunctions.js';

test('GenNode', () => {
    const input = `{
  $c->forward('method');
  }`;
    assert(JSON.stringify(genJavaAstDebug(input), null, 2) === 
`{
  "type": "SourceFile",
  "body": [
    {
      "type": "BlockStatement",
      "body": [
        {
          "type": "GenNode",
          "prompt": "This is a mock system prompt.This is some extra information",
          "content": "$c->forward('method')"
        }
      ]
    }
  ]
}`
);});