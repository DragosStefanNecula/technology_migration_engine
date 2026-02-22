import test from 'node:test';
import assert from 'node:assert';
import { handlePerl } from '../../components/migrationLogic.js';

test('FunctionDefinition', () => {
    const input = `sub profile :Path('/user/profile') :Args(1) {
    my ($self, $c, $user_id) = @_;
    42;
    33;
}`;
    assert(handlePerl(input) === 
`@GetMapping("/user/profile/{user_id}")
public String profile(@PathVariable String user_id)
{
  42;
  33;
}`
);});