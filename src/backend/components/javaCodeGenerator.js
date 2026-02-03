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
            throw `Unexpected expression "${node.type}".`
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

    ParanthesizedArray(node){
        return `(${this.gen(node.value)})`;
    }
}