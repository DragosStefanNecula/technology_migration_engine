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
        return `{${node.body.map(exp => this.gen(exp))}.join('\n')}`;
    }

    expressionStatement(node){
        return `${this.gen(node.exp)};`
    }
}