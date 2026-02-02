# Perl Syntax Inventory

This aims to be a inventory of all relevant syntax that will be transpiled using programmatic methods. Notably, this is not a comprehensive inventory of all Perl syntax.

## Variables

### Scalars

    [ ] my $x = 10;

### Arrays

    [ ] my @items = (1,2,3);
    [ ] push @items, 4; 
    [ ] my $list = [1,2,3];

### Hashes

    [ ] my %user = (name => "Alice", age => 30);
    [ ] $user{name};
    [ ] my $data = { name => "Alice", roles => ["admin","user"] };

### Misc

    [ ] $data->{roles}[0];

## Expressions

    [ ] $a++

### Binary Expression Examples

    [ ] ($x + $y) * $z
    [ ] $a == $b || $c == $d && $e != $f
    [ ] ($x + $y) > $z ? $x * $z : $y * $z
    [ ] $first . " " . $last
    [ ] $a eq $b || $x == $y
    [ ] $a ** 2

### Operators

    [ ] +
    [ ] -
    [ ] *
    [ ] /
    [ ] %
    [ ] **
    [ ] ==
    [ ] !=
    [ ] <
    [ ] <=
    [ ] >
    [ ] >=
    [ ] eq
    [ ] ne
    [ ] &&
    [ ] ||
    [ ] =
    [ ] .
    [ ] ++
    [ ] --
    [ ] ?:

    [ ] +=
    [ ] -=
    [ ] *=
    [ ] /=

## Control Flow

### Subroutines

    [ ] sub ...

### If / Esilf / Else

    [ ] if ($x > 0) { ... }
    [ ] elsif ($x == 0) { ... }
    [ ] else { ... }
    [ ] unless { ... }

### Loops

    [ ] foreach my $item (@items) { ... }
    [ ] for (my $i=0; $i<10; $i++) { ... }
    [ ] while (true) { ... }
    [ ] until ($done) { ... }

### Flow Keywords

    [ ] next;     -> continue
    [ ] last;     -> break
    [ ] redo;     -> restart loop iteration
    [ ] return; 
    [ ] die;
    [ ] exit;

## Catalyst / MVC Specific

### Method

    [ ] Path
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
