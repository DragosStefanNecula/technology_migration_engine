export class JavaCodegen{

    constructor({indent = 2}){
        this._indent = indent;
        this._currentIndent = 0;
    }

    generate(node){
        return gen(node);
    }

    gen(node){
        if(this[node.type] == null){
            throw `Unexpected expression "${node.type}".`
        }
        return this[node.type](node);
    }

    _ind(){
        return ' '.repeat(this._currentIndent);
    }
}