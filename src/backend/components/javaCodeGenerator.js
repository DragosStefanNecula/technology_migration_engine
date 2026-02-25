export class JavaCodegen{

    constructor({indent = 2}){
        this._indent = indent;
        this._currentIndent = 0;
    }

    // Strucutral

    generate(node){
        return this.gen(node);
    }

    gen(node){
        if(this[node.type] == null){
            throw Error(`Unexpected expression "${node.type}".`)
        }
        return this[node.type](node);
    }

    SourceFile(node){
       return node.body.map(child => this.gen(child)).join('\n');
    }

    BlockStatement(node){
        let result = `${this._ind()}{\n`;
        this._currentIndent += this._indent;

        result += `${node.body.map(exp => this._ind() + this.gen(exp)).join('\n')}`;

        this._currentIndent -= this._indent;

        result += `\n${this._ind()}}`;

        return result;
    }

    FunctionDefinition(node){
        let functionDef = "";

        const params = node.params.filter(n => n !== "self" && n !== "c");
        let javaParams = '';
        if(node.path){
            let pathParams = "";
            if(node.args === -1)
            {
                javaParams = `@RequestParam Map<String, String> ${params[0]}`;
            } else if (node.args > 0)
            {
                pathParams += `/${params.map(p => `{${p}}`).join("/")}`;
                javaParams = params.map(p => `@PathVariable String ${p}`).join(', ');
            }
            functionDef += this._ind() + `@GetMapping("${node.path}${pathParams}")\n`
        } else {
            javaParams = params.map(p => `String ${p}`).join(', ');
        } 

        functionDef += this._ind() + `public String ${node.definition}(${javaParams})\n`;

        functionDef += this.gen(node.block);
        
        return functionDef;
    }

    IfStatement(node){
        let ifDefinition = "";

        ifDefinition += this._ind() + `if${this.gen(node.condition)}\n`;

        ifDefinition += this.gen(node.block);

        ifDefinition += node.alternativeClauses.map(exp => '\n' + this.gen(exp)).join(''); 

        return ifDefinition;
    }

    ElsifStatement(node){
        let elsifDefinition = "";

        elsifDefinition += this._ind() + `else if${this.gen(node.condition)}\n`;

        elsifDefinition += this.gen(node.block);

        return elsifDefinition;
    }

    ElseStatement(node){
        let elseDefinition = "";

        elseDefinition += this._ind() + `else\n`;

        elseDefinition += this.gen(node.block);

        return elseDefinition;
    }

    UnlessStatement(node){
        let ifDefinition = "";

        ifDefinition += this._ind() + `if(!${this.gen(node.condition)})\n`;

        ifDefinition += this.gen(node.block);

        ifDefinition += node.alternativeClauses.map(exp => '\n' + this.gen(exp)).join(''); 

        return ifDefinition;
    }

    WhileStatement(node){
        let whileDefinition = "";

        whileDefinition += this._ind() + `while${this.gen(node.condition)}\n`;

        whileDefinition += this.gen(node.block);

        return whileDefinition;
    }

    UntilStatement(node){
        let whileDefinition = "";

        whileDefinition += this._ind() + `while(!${this.gen(node.condition)})\n`;

        whileDefinition += this.gen(node.block);

        return whileDefinition;
    }

    ControlFlowExpression(node){
        return `${node.value}`;
    }

    ReturnExpression(node){
        return `return${node.value ? " " + this.gen(node.value) : ""}`
    }

    ErrorExpression(node){
        return `throw new RuntimeException(${this.gen(node.value)})`;
    }

    _ind(){
        return ' '.repeat(this._currentIndent);
    }

    // Statements

    ExpressionStatement(node){
        return `${this.gen(node.exp)};`
    }

    IntegerLiteral(node){
        return `${node.value}`;
    }

    StringLiteral(node){
        return `${node.value}`
    }

    UnaryExpression(node){
        return `${this.gen(node.left)}${this.gen(node.operator)}`
    }
    
    NegativeExpression(node){
        return `${this.gen(node.operator)}${this.gen(node.right)}`
    }

    BinaryExpression(node) {
        if(node.operator.value == "STRING_EQ"){
            return `${this.gen(node.left)}.equals(${this.gen(node.right)})`
        }
        if(node.operator.value == "STRING_NE"){
            return `!${this.gen(node.left)}.equals(${this.gen(node.right)})`
        }
        if(node.operator.value == "POW"){
            return `Math.pow(${this.gen(node.left)}, ${this.gen(node.right)})`
        }
        return `${this.gen(node.left)} ${this.gen(node.operator)} ${this.gen(node.right)}`;
    }

    TernaryExpression(node) {
        return `${this.gen(node.left)} ? ${this.gen(node.middle)} : ${this.gen(node.right)}`
    }

    Operator(node) {
        return `${node.value}`;
    }

    Identifier(node)
    {
        return `${node.name}`;
    }

    CallExpression(node){
        JSON.stringify(node)
        return `${node.identifier}(${node.arg.body.map(exp => this.gen(exp)).join(',')})`
    }

    ParanthesizedExpression(node){
        return `(${this.gen(node.value)})`;
    }

    ParanthesizedArgument(node){
        return `(${node.body.map(child => this.gen(child)).join('\n')})`;
    }

    ScalarVariableDeclaration(node){
        return `Object ${this.gen(node.declared)}`;
    }

    // Arrays & Hashes

    ArrayDeclaration(node){
        return `ArrayList ${node.identifier} = new ArrayList()`
    }

    ArrayAssignment(node){
        const listElem = `${node.assignment.map(exp => this.gen(exp)).join(', ')}`;

        return `${node.identifier} = new ArrayList(List.of(${listElem}))`;
       ;
    }

    ArrayAssignmentDeclaration(node){
        return `ArrayList ${this.gen(node.arrayAssignment)}`;
    }

    HashDeclaration(node){
        return `HashMap ${node.identifier} = new HashMap()`
    }
    
    HashAssignment(node){
        const kvPairs = Object.entries(node.assignment)
        .map(([key, exp]) => "'" + key + "', " + this.gen(exp))
        .join(', ');

        return `${node.identifier} = new HashMap(Map.of(${kvPairs}))`
    }

    HashAssignmentDeclaration(node){
        return `HashMap ${this.gen(node.hashAssignment)}`;
    }

    HashAccess(node){
        return `${node.identifier}.get('${node.key}')`
    }

    DeleteHash(node){
        let hashAccess = node.hashAccess.body[0];
        return `${hashAccess.identifier}.remove("${hashAccess.key}")`
    }

    ContainsHash(node){
        let hashAccess = node.hashAccess.body[0];
        return `${hashAccess.identifier}.containsKey("${hashAccess.key}")`
    }

    ArrayAccessVariable(node){
        return `${node.identifier}.get(${node.index})`
    }

    ArrayFunctionPop(node){
        return `${node.arrayIdentifier}.remove(${node.arrayIdentifier}.size() - 1)`
    }

    ArrayFunctionShift(node){
        return `${node.arrayIdentifier}.remove(0)`
    }

    ArrayFunctionPush(node){
        return `${node.arrayElements.map(child => node.arrayIdentifier + ".add(" + this.gen(child) + ")").join("; ")};`
    }

    ArrayFunctionUnshift(node){
        return `${node.arrayElements.map(child => node.arrayIdentifier + ".add(0, " + this.gen(child) + ")").join("; ")};`
    }

    ArrayFunctionReverse(node){
        return `Collections.reverse(${node.arrayIdentifier})`
    }

    // Gen Logic

    GenNode(node){
        return node.content;
    }
}