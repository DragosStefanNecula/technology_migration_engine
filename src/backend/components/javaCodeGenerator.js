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

    functionDefinition(node){
        let functionDef = "";

        const params = node.params.filter(n => n !== "self" && n !== "c");
        let javaParams = '';
        if(node.path){
            functionDef += this._ind() + `@GetMapping("${node.path}")\n`
            if(node.args === -1)
            {
                javaParams = `@RequestParam Map<String, String> ${params[0]}`
            } else if (node.args > 0)
            {
                javaParams = params.map(p => `@PathVariable String ${p}`).join(', ');
            }
        } else {
            javaParams = params.map(p => `String ${p}`).join(', ');
        } 

        functionDef += this._ind() + `public String ${node.definition}(${javaParams})\n`;

        functionDef += this.gen(node.block);
        
        return functionDef;
    }

    expressionStatement(node){
        return `${this.gen(node.exp)};`
    }

    _ind(){
        return ' '.repeat(this._currentIndent);
    }
}