import test from 'node:test';
import assert from 'node:assert';

import { handlePerlDebug } from '../testingFunctions.js';

test('ScalarVariableDeclaration', () => {
  const input = `
    {
      my $a;
      my $a = 2;
    }
  `;
  assert(handlePerlDebug(input) === 
`{
  Object a;
  Object a = 2;
}`);});

test('IntegerLiteral', () => {

  const input = `
    42;
  `;

  assert(handlePerlDebug(input) === "42;");
});

test('StringLiteral', () => {

  const input = `
    "42";
  `;

  assert(handlePerlDebug(input) === '"42";');
});

test('ScalarVariable/Identifier', () => {

  const input = `
    $42;
  `;

  assert(handlePerlDebug(input) === "42");
});


test('ControlFlowCommand', () => {

  const input = `
    {
      last;
      next;
      return;
    }
  `;

  assert(handlePerlDebug(input) === `{
  break;
  continue;
  return;
}`);
});

test('Return', () => {

  const input = `
    {
      return $a
    }
  `;

  assert(handlePerlDebug(input) === `{
  return a;
}`);
});

test('Error', () => {

  const input = `
    {
      die "Something went wrong";
    }
  `;

  assert(handlePerlDebug(input) === `{
  throw new RuntimeException("Something went wrong");
}`);
});

test('CallExpression', () => {

const input = `
  {
    methodCall($a, $b);
  }
`;

assert(handlePerlDebug(input) === 
`{
  methodCall(a,b);
}`
);

});

test('BarewordCallExpression', () => {

const input = `
  {
    methodCall $a, $b;
  }
`;

assert(handlePerlDebug(input) === 
`{
  methodCall(a,b);
}`
);

});

// Arrays & Hashes

test('ArrayBlankDeclaration', () => {

const input = `
  {
    my @a;
  }
`;

assert(handlePerlDebug(input) === 
`{
  ArrayList a = new ArrayList();
}`
);

});

test('ArrayAssignmentDeclaration', () => {

const input = `
  {
    my @a = (1, 2, 3);
  }
`;

assert(handlePerlDebug(input) === 
`{
  ArrayList a = new ArrayList(List.of(1, 2, 3));
}`
);

});

test('ArrayAssignment', () => {

const input = `
  {
    @a = (1, 2, 3);
  }
`;

assert(handlePerlDebug(input) === 
`{
  a = new ArrayList(List.of(1, 2, 3));
}`
);

});

test('ArrayGet', () => {
  const input = `
    {
      $array[0];
    }
  `;
  assert(handlePerlDebug(input) === 
`{
  array.get(0);
}`);});

test('ArrayPop', () => {
  const input = `
    {
      pop @array;
    }
  `;
  assert(handlePerlDebug(input) === 
`{
  array.remove(array.size() - 1);
}`);});

test('ArrayShift', () => {
  const input = `
    {
      shift @array;
    }
  `;
  assert(handlePerlDebug(input) === 
`{
  array.remove(0);
}`);});

test('ArrayPush', () => {
  const input = `
    {
      push @fruits, 'kiwi', 42;
    }
  `;
  assert(handlePerlDebug(input) === 
`{
  fruits.add('kiwi'); fruits.add(42);
}`);});

test('ArrayUnshift', () => {
  const input = `
    {
      unshift @fruits, 'kiwi', 42;
    }
  `;
  assert(handlePerlDebug(input) === 
`{
  fruits.add(0, 'kiwi'); fruits.add(0, 42);
}`);});

test('ArrayReverse', () => {
  const input = `
    {
      reverse @fruits;
    }
  `;
  assert(handlePerlDebug(input) === 
`{
  Collections.reverse(fruits);
}`);});

test('HashBlankDeclaration', () => {

const input = `
  {
    my %h;
  }
`;

assert(handlePerlDebug(input) === 
`{
  HashMap h = new HashMap();
}`
);

});

test('HashAssignmentDeclaration', () => {

const input = `
  {
    my %h = (name => "Alice", age => 30);
  }
`;

assert(handlePerlDebug(input) === 
`{
  HashMap h = new HashMap(Map.of('name', "Alice", 'age', 30));
}`
);

});

test('HashAssignment', () => {

const input = `
  {
    %h = (name => "Alice", age => 30);
  }
`;

assert(handlePerlDebug(input) === 
`{
  h = new HashMap(Map.of('name', "Alice", 'age', 30));
}`
);

});

test('AlternativeHashAssignment', () => {

const input = `
  {
    my %h = ("name", "Alice", "age", 30);
  }
`;

assert(handlePerlDebug(input) === 
`{
  HashMap h = new HashMap(Map.of('name', "Alice", 'age', 30));
}`
);

});

test('HashAccess', () => {
  const input = `
    {
      $user{name};
    }
  `;
  assert(handlePerlDebug(input) === 
`{
  user.get('name');
}`);});

test('DeleteHash', () => {
  const input = `
    {
      delete $hash{banana};
    }
  `;
  assert(handlePerlDebug(input) === 
`{
  hash.remove("banana");
}`);});

test('ExistsHash', () => {
  const input = `
    {
      exists $hash{key};
    }
  `;
  assert(handlePerlDebug(input) === 
`{
  hash.containsKey("key");
}`);});

test('MultipleAccesses', () => {
    const input = `$data->{roles}[0];`;
    assert(handlePerlDebug(input) === 
`data.get('roles').get(0);`
);});

