import test from 'node:test';
import assert from 'node:assert';

import { handlePerlDebug } from '#src/backend/tests/testingFunctions.js';

test('FunctionDefinition', () => {
    const input = `sub profile :Path('/user/profile') :Args(1) {
    my ($self, $c, $user_id) = @_;
    42;
    33;
}`;
    assert(handlePerlDebug(input) === 
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
    assert(handlePerlDebug(input) === 
`if(a == b || c == d && e != f)
{

}`
);});

test('ElsifStatement', () => {
    const input = `if ($a == $b || $c == $d && $e != $f) {
}
elsif ($number == 5) {
}`;
    assert(handlePerlDebug(input) === 
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
    assert(handlePerlDebug(input) === 
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
    assert(handlePerlDebug(input) === 
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
    assert(handlePerlDebug(input) === 
`if(!(x > 10))
{

}`
);});

test('WhileStatement', () => {
    const input = `while ($i <= 5) {

}`;
    assert(handlePerlDebug(input) === 
`while(i <= 5)
{

}`
);});

test('UntilStatement', () => {
    const input = `until ($count > 5) {
}`;
    assert(handlePerlDebug(input) === 
`while(!(count > 5))
{

}`
);});

test('ForStatement', () => {
    const input = `for (my $i=0; $i<10; $i++){
}`;
    assert(handlePerlDebug(input) === 
`for(int i; i < 10; i++)
{

}`
);});

test('ForeachStatement', () => {
    const input = `foreach my $item (@items) { 42; }`;
    assert(handlePerlDebug(input) === 
`for (Object item : items)
{
  42;
}`
);});