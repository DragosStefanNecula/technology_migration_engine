# Perl Syntax Inventory

This aims to be a inventory of all relevant syntax that will be transpiled using programmatic methods. Notably, this is not a comprehensive inventory of all Perl syntax.

## Variables

## Types

    [X] Integer Literal
    [X] String Literal

### Scalars

    [X] my $x = 10;
    [X] my $x;

### Arrays

    [X] my @items;
    [X] my @items = (1,2,3);
    [X] @items = (1,2,3);
    [X] push @items, 4; 
    [X] push @fruits, 'kiwi', 42;
    [ ] push @fruits, @otherArray;
    [ ] push @numbers, (1, 2, 3)
    [X] unshift @fruits, 'kiwi', 42;
    [ ] unshift @fruits, @otherArray;
    [X] my $first = shift @fruits;
    [X] my @rev = reverse @fruits;
    [ ] my @sorted = sort @fruits;
    [X] pop @array;
    [ ] my $list = [1,2,3];
    [X] $array[0]; 

### Hashes

    [X] my %user;
    [X] my %user = (name => "Alice", age => 30);
    [X] my %h = ("a", 1, "b", 2);
    [X] %user = (name => "Alice", age => 30);
    [X] my $name = $user{name};
    [ ] my $data = { name => "Alice", roles => ["admin","user"] };
    [X] delete $hash{banana};
    [X] exists $hash{key}

### Misc

    [ ] $data->{roles}[0];
    [ ] $obj->method($arg);
    [ ] Comments

## Expressions

### Binary Expression Examples

    [X] 4 + 2
    [X] ($x + $y) * $z
    [X] $a == $b || $c == $d && $e != $f
    [X] ($x + $y) > $z ? $x * $z : $y * $z
    [X] $first . " " . $last
    [X] $a eq $b || $x ne $y
    [X] $a ** 2

### Operators

    [X] +
    [X] -
    [X] *
    [X] /
    [X] %
    [X] **
    [X] ==
    [X] !=
    [X] <
    [X] <=
    [X] >
    [X] >=
    [X] eq
    [X] ne
    [X] &&
    [X] ||
    [X] =
    [X] .
    [X] ++
    [X] --
    [X] ?:
    [X] !
    [X] +=
    [X] -=
    [X] *=
    [X] /=
    [X] not
    [ ] and
    [ ] or

## Control Flow

    [X] Source File
    [X] Block Statements

### Subroutines

    [X] sub ...
    [X] callExpression($arg1, $arg2);
    [X] callExpression $arg1, $arg2;

### If / Esilf / Else

    [X] if ($x > 0) { ... }
    [X] elsif ($x == 0) { ... }
    [X] else { ... }
    [X] unless { ... }
    [ ] try/catch

### Loops

    [ ] foreach my $item (@items) { ... }
    [ ] for (my $i=0; $i<10; $i++) { ... }
    [X] while (true) { ... }
    [ ] until ($done) { ... }

### Flow Keywords

    [X] next;     -> continue
    [X] last;     -> break
    [ ] redo;     -> restart loop iteration
    [X] return; 
    [X] die;

## Catalyst / MVC Specific

### Method

    [ ] Path$
    [ ] Args
    [ ] Chained

### Stash

    [ ] $c->stash->{user} = $user;
    [ ] $c->stash(template => 'user.tt');

### Control

    [ ] $c->forward('method');
    [ ] $c->detach('/error');
    [ ] $c->res->body("OK");
    [ ] $c->res->status(404);
    [ ] $c->res->redirect($url);
