export class JavaCodegen{
    constructor({indent = 2}){
        this._indent = indent;
        this._currentIndent = 0;
    }

    generate(exp){
        return this.SourceFile(exp);
    }

    SourceFile(exp){
        return exp.body.map(exp => this.gen(exp)).join('\n');
    }

    gen(exp){
        if(this[exp.type] == null){
            throw `Unexpected expression "${exp.type}".`
        }
        return this[exp.type](exp);
    }

    NumericLiteral(exp){
        return `${exp.value}`;
    }
}