# Test Driven Development

## List of Incidents

This is a list of every time Test Driven Development saved me.

Current Count: 8

I forgot a extra bracket at the end: HashMap h = new HashMap(Map.of('name', "Alice", 'age', 30);

I added an extra semicolon: ArrayList a = new ArrayList();;

I had to modify the grammar.js file and make sure everything still works.

When adding gen code it rebubbled nodes that were ignored by default I wasn't aware of

When modifying some less understood types such as paranthesized arguments, ensuring I haven't broken anything

When modifying how hash access and array access works to be more general, broke a couple of unexpected cases

I needed to figure out what other syntaxes are based on ParanthesizedArgument, so I made that fail and saw what tests fail

20 individual cases where it saved me whilst editing 400 lines of code to switch from string accumulation to emitting