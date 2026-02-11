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
        return `${node.arrayIdentifier}.remove(list.size() - 1)`
    }

    ArrayFunctionPush(node){
        return `${node.arrayElements.map(child => node.arrayIdentifier + ".add(" + this.gen(child) + ")").join("; ")};`
    }
}