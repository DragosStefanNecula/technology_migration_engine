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

test('IfStatement', () => {
    const input = `if ($a == $b || $c == $d && $e != $f) {
}`;
    assert(handlePerl(input) === 
`if(a == b || c == d && e != f)
{

}`
);});

test('ElsifStatement', () => {
    const input = `if ($a == $b || $c == $d && $e != $f) {
}
elsif ($number == 5) {
}`;
    assert(handlePerl(input) === 
`if(a == b || c == d && e != f)
{

}
else if(number == 5)
{

}`
);});

test('ElseStatement', () => {
    const input = `if ($a == $b || $c == $d && $e != $f) {
}
else {
}`;
    assert(handlePerl(input) === 
`if(a == b || c == d && e != f)
{

}
else
{

}`
);});

test('MultipleAlternativeClauses', () => {
    const input = `if ($a == $b || $c == $d && $e != $f) {
}
elsif ($number == 5) {
}
elsif ($number == 6) {
}
else {
}`;
    assert(handlePerl(input) === 
`if(a == b || c == d && e != f)
{

}
else if(number == 5)
{

}
else if(number == 6)
{

}
else
{

}`
);});

test('UnlessStatement', () => {
    const input = `unless ($x > 10) {
}`;
    assert(handlePerl(input) === 
`if(!(x > 10))
{

}`
);});

test('WhileStatement', () => {
    const input = `while ($i <= 5) {

}`;
    assert(handlePerl(input) === 
`while(i <= 5)
{

}`
);});