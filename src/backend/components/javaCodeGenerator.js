export class JavaCodegen{
    constructor({indent = 2}){
        this._indent = indent;
        this._currentIndent = 0;
    }

    generate(node){
        return this.ordinaryCompilationUnit(node);
    }

    ordinaryCompilationUnit(node){
        return node.body.map(child => this.gen(child)).join('\n');
    }

    gen(node){
        if(this[node.type] == null){
            throw `Unexpected expression "${node.type}".`
        }
        return this[node.type](node);
    }

    integerLiteral(node){
        return `${node.value}`;
    }

    stringLiteral(node){
        return `${node.value}`
    }

    blockStatement(node){
        let result = `${this._ind()}{\n`;
        this._currentIndent += this._indent;

        result += `${node.body.map(exp => this._ind() + this.gen(exp)).join('\n')}`;

        this._currentIndent -= this._indent;

        result += `\n${this._ind()}}`;

        return result;
    }

    expressionStatement(node){
        return `${this.gen(node.exp)};`
    }

    _ind(){
        return ' '.repeat(this._currentIndent);
    }
}