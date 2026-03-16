export class JavaCodegen{

    constructor({indent = 2}){
        this._indent = indent;
        this._currentIndent = 0;
        this._buffer = [];
        this._function = "source";
    }

    generate(node) {
        this._buffer = [];
        this._currentIndent = 0;
        this.gen(node);
        return this._buffer;
    }

    gen(node) {
        if (!this[node.type]) {
            throw Error(`Unexpected expression "${node.type}".`);
        }
        this[node.type](node);
    }

    _emitBase(value, type) {
        this._buffer.push({type: type, value: value, function: this._function});
    }

    _emit(value){
        this._emitBase(value, "text");
    }

    _withIndent(fn) {
        this._currentIndent += this._indent;
        fn();
        this._currentIndent -= this._indent;
    }

    _ind() {
        return ' '.repeat(this._currentIndent);
    }

    _output() {
        
    }

    // Strucutral

    SourceFile(node) {
        node.body.forEach((child, i) => { 
            this.gen(child);
            if (i < node.body.length - 1) this._emit('\n');
        });
    }

    BlockStatement(node){
        this._emit(`${this._ind()}{\n`);

        this._currentIndent += this._indent;

        node.body.forEach((child, i) => { 
            this._emit(this._ind());
            this.gen(child);
            if (i < node.body.length - 1) this._emit('\n');
        });

        this._currentIndent -= this._indent;

        this._emit(`\n${this._ind()}}`);
    }

    FunctionDefinition(node) {
        const params = node.params.filter(n => n !== "self" && n !== "c");

        let javaParams = '';

        this._function = node.context;

        if (node.path) {
            let pathParams = "";

            if (node.args === -1) {
                javaParams = `@RequestParam Map<String, String> ${params[0]}`;
            } else if (node.args > 0) {
                pathParams += `/${params.map(p => `{${p}}`).join("/")}`;
                javaParams = params.map(p => `@PathVariable String ${p}`).join(', ');
            }

            this._emit(this._ind());
            this._emit(`@GetMapping("${node.path}${pathParams}")`);
            this._emit("\n");
        } else {
            javaParams = params.map(p => `String ${p}`).join(', ');
        }

        this._emit(this._ind());
        this._emit(`public String ${node.definition}(${javaParams})`);
        this._emit("\n");

        this.gen(node.block);

        this._function = "source"
    }

    IfStatement(node){
        this._emit(`${this._ind()}if`); 
        this.gen(node.condition); 
        this._emit(`\n`); 

        this.gen(node.block); 

        node.alternativeClauses.forEach(exp => {
            this._emit("\n");
            this.gen(exp);
        });
    }

    ElsifStatement(node){
        this._emit(`${this._ind()}else if`); 
        this.gen(node.condition); 
        this._emit(`\n`); 

        this.gen(node.block); 
    }

    ElseStatement(node){
        this._emit(`${this._ind()}else\n`); 
        this.gen(node.block); 
    }

    UnlessStatement(node){
        this._emit(`${this._ind()}if(!`); 
        this.gen(node.condition); 
        this._emit(`)\n`); 

        this.gen(node.block); 

        node.alternativeClauses.forEach(exp => {
            this._emit("\n");
            this.gen(exp);
        });
    }

    WhileStatement(node){
        this._emit(`${this._ind()}while`); 
        this.gen(node.condition); 
        this._emit(`\n`); 

        this.gen(node.block); 
    }

    UntilStatement(node){
        this._emit(`${this._ind()}while(!`); 
        this.gen(node.condition); 
        this._emit(`)\n`); 

        this.gen(node.block); 
    }

    ForStatement(node){
        this._emit(`${this._ind()}for(int ${node.initialization.name}; `); 
        this.gen(node.condition); 
        this._emit(`; `); 
        this.gen(node.increment); 
        this._emit(`)\n`); 

        this.gen(node.block); 
    }

    ForeachStatement(node){
        this._emit(`${this._ind()}for (Object `); 
        this.gen(node.individual); 
        this._emit(` : `); 
        this.gen(node.array); 
        this._emit(`)\n`); 

        this.gen(node.block); 
    }

    ControlFlowExpression(node){
        this._emit(`${node.value}`); 
    }

    ReturnExpression(node){
        this._emit("return");
        if (node.value) {
            this._emit(" ");
            this.gen(node.value);
        }
    }

    ErrorExpression(node){
        this._emit(`throw new RuntimeException(`); 
        this.gen(node.value);
        this._emit(`)`); 
    }

    _ind(){
        return ' '.repeat(this._currentIndent);
    }

    // Statements

    ExpressionStatement(node){
        this.gen(node.exp);
        this._emit(`;`);
    }

    IntegerLiteral(node){
        this._emit(`${node.value}`);
    }

    StringLiteral(node){
        this._emit(`${node.value}`);
    }

    UnaryExpression(node){
        this.gen(node.left);
        this.gen(node.operator);
    }
    
    NegativeExpression(node){
        this.gen(node.operator);
        this.gen(node.right);
    }

    BinaryExpression(node) {
        if(node.operator.value == "STRING_EQ"){
            this.gen(node.left); 
            this._emit(`.equals(`); 
            this.gen(node.right);
            this._emit(`)`);
            return;
        }
        if(node.operator.value == "STRING_NE"){
            this._emit('!');
            this.gen(node.left);
            this._emit('.equals(');
            this.gen(node.right);
            this._emit(')');
            return;
        }
        if(node.operator.value == "POW"){
            this._emit('Math.pow(');
            this.gen(node.left);
            this._emit(', ');
            this.gen(node.right);
            this._emit(')');
            return;
        }
        this.gen(node.left);
        this._emit(' ');
        this.gen(node.operator); 
        this._emit(' '); 
        this.gen(node.right); 
    }

    TernaryExpression(node) {
        this.gen(node.left); 
        this._emit(' ? '); 
        this.gen(node.middle);
        this._emit(' : '); 
        this.gen(node.right); 
    }

    Operator(node) {
        this._emit(`${node.value}`); 
    }

    Identifier(node)
    {
        this._emit(`${node.name}`); 
    }

    CallExpression(node){
        this._emit(`${node.identifier}(`); 
        node.arg.body.forEach((child, i) => { 
            this.gen(child);
            if (i < node.arg.body.length - 1) this._emit(',');
        });
        this._emit(`)`); 
    }

    ParanthesizedExpression(node){
        this._emit(`(`); 
        this.gen(node.value); 
        this._emit(`)`); 
    }

    ParanthesizedArgument(node){
        this._emit(`(`); 
        node.body.forEach((child, i) => { 
            this.gen(child);
            if (i < node.body.length - 1) this._emit(',');
        });
        this._emit(`)`); 
    }

    ScalarVariableDeclaration(node){
        this._emit(`Object `); 
        this.gen(node.declared); 
    }

    // Arrays & Hashes

    MethodInvocation(node){
        this.gen(node.object); 
        this._emit(`.${node.method}`); 
        this.gen(node.arguments); 
    }

    ArrayDeclaration(node){
        this._emit(`ArrayList ${node.identifier} = new ArrayList()`); 
    }

    ArrayAssignment(node){
        this._emit(`${node.identifier} = new ArrayList(List.of(`); 
        node.assignment.forEach((child, i) => { 
            this.gen(child);
            if (i < node.assignment.length - 1) this._emit(', ');
        });
        this._emit(`))`); 
    }

    ArrayAssignmentDeclaration(node){
        this._emit(`ArrayList `); 
        this.gen(node.arrayAssignment); 
    }

    HashDeclaration(node){
        this._emit(`HashMap ${node.identifier} = new HashMap()`); 
    }
    
    HashAssignment(node){
        this._emit(`${node.identifier} = new HashMap(Map.of(`); 
        Object.entries(node.assignment).forEach(([key, exp], i, arr) => {
            this._emit("'" + key + "', ");
            this.gen(exp);
            if (i < arr.length - 1) this._emit(', ');
        });
        this._emit(`))`); 
    }

    HashAssignmentDeclaration(node){
        this._emit(`HashMap `); 
        this.gen(node.hashAssignment); 
    }

    HashAccess(node){
        this.gen(node.left); 
        this._emit(`.get('${node.key}')`); 
    }

    DeleteHash(node){
        let hashAccess = node.hashAccess.body[0];
        this._emit(`${hashAccess.left.name}.remove("${hashAccess.key}")`);
    }

    ContainsHash(node){
        let hashAccess = node.hashAccess.body[0];
        this._emit(`${hashAccess.left.name}.containsKey("${hashAccess.key}")`);
    }

    ArrayAccessVariable(node){
        this.gen(node.left); 
        this._emit(`.get(${node.index})`); 
    }

    ArrayFunctionPop(node){
        this._emit(`${node.arrayIdentifier}.remove(${node.arrayIdentifier}.size() - 1)`); 
    }

    ArrayFunctionShift(node){
        this._emit(`${node.arrayIdentifier}.remove(0)`); 
    }

    ArrayFunctionPush(node){
        node.arrayElements.forEach((child, i) => {
            this._emit(node.arrayIdentifier + ".add(");
            this.gen(child);
            this._emit(")");
            if (i < node.arrayElements.length - 1) this._emit("; ");
        });
        this._emit(";");
    }

    ArrayFunctionUnshift(node){
        node.arrayElements.forEach((child, i) => {
            this._emit(node.arrayIdentifier + ".add(0, ");
            this.gen(child);
            this._emit(")");
            if (i < node.arrayElements.length - 1) this._emit("; ");
        });
        this._emit(";");
    }

    ArrayFunctionReverse(node){
        this._emit(`Collections.reverse(${node.arrayIdentifier})`); 
    }

    // Gen Logic

    GenNode(node){
        return ``
    }
}