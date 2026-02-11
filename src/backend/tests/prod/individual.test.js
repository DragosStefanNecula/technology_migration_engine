import test from 'node:test';
import assert from 'node:assert';

import { parsePerl } from '../../components/perlParser.js';
import { handlePerl } from '../../components/migrationLogic.js';

test('ScalarVariableDeclaration', () => {
  const input = `
    {
      my $a;
      my $a = 2;
    }
  `;
  assert(handlePerl(input) === 
`{
  Object a;
  Object a = 2;
}`);});

test('IntegerLiteral', () => {

  const input = `
    42;
  `;

  assert(handlePerl(input) === "42;");
});

test('StringLiteral', () => {

  const input = `
    "42";
  `;

  assert(handlePerl(input) === '"42";');
});

test('ScalarVariable/Identifier', () => {

  const input = `
    $42;
  `;

  assert(handlePerl(input) === "42");
});


test('ControlFlowCommand', () => {

  const input = `
    {
      last;
      next;
      return;
    }
  `;

  assert(handlePerl(input) === `{
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

  assert(handlePerl(input) === `{
  return a;
}`);
});

test('Error', () => {

  const input = `
    {
      die "Something went wrong";
    }
  `;

  assert(handlePerl(input) === `{
  throw new RuntimeException("Something went wrong");
}`);
});

test('CallExpression', () => {

const input = `
  {
    methodCall($a, $b);
  }
`;

assert(handlePerl(input) === 
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

assert(handlePerl(input) === 
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

assert(handlePerl(input) === 
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

assert(handlePerl(input) === 
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

assert(handlePerl(input) === 
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
  assert(handlePerl(input) === 
`{
  array.get(0);
}`);});

test('ArrayPop', () => {
  const input = `
    {
      pop @array;
    }
  `;
  assert(handlePerl(input) === 
`{
  array.remove(array.size() - 1);
}`);});

test('ArrayShift', () => {
  const input = `
    {
      shift @array;
    }
  `;
  assert(handlePerl(input) === 
`{
  array.remove(0);
}`);});

test('ArrayPush', () => {
  const input = `
    {
      push @fruits, 'kiwi', 42;
    }
  `;
  assert(handlePerl(input) === 
`{
  fruits.add('kiwi'); fruits.add(42);
}`);});

test('ArrayUnshift', () => {
  const input = `
    {
      unshift @fruits, 'kiwi', 42;
    }
  `;
  assert(handlePerl(input) === 
`{
  fruits.add(0, 'kiwi'); fruits.add(0, 42);
}`);});

test('ArrayReverse', () => {
  const input = `
    {
      reverse @fruits;
    }
  `;
  assert(handlePerl(input) === 
`{
  Collections.reverse(fruits);
}`);});

test('HashBlankDeclaration', () => {

const input = `
  {
    my %h;
  }
`;

assert(handlePerl(input) === 
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

assert(handlePerl(input) === 
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

assert(handlePerl(input) === 
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

assert(handlePerl(input) === 
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
  assert(handlePerl(input) === 
`{
  user.get('name');
}`);});

test('DeleteHash', () => {
  const input = `
    {
      delete $hash{banana};
    }
  `;
  assert(handlePerl(input) === 
`{
  hash.remove("banana");
}`);});

test('ExistsHash', () => {
  const input = `
    {
      exists $hash{key};
    }
  `;
  assert(handlePerl(input) === 
`{
  hash.containsKey("key");
}`);});