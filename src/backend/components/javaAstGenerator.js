export function genJavaAst(astRoot){
    return gen(astRoot);
}

function gen(node){

    // Structural

    if(node.type === "source_file") {
        return {
            type: "SourceFile",
            body: Helper.genBody(node.children)
        }
    }

    if(Helper.isIgnored(node)){
        return;
    }

    // Statements

    if(node.type === "integer"){
        return {
            type: "IntegerLiteral",
            value: node.text
        }
    }
}

class JavaAstHelper{
    constructor() {
        this.IGNORED_NODE_TYPES = new Set([";", "{", "}"]);
    }

    genMultiple(nodes) {
        if(!nodes) return;
        const body = nodes.reduce((acc, child) => {
            const generated = gen(child);
            if (generated !== undefined) {
                acc.push(generated);
            }
            return acc;
        }, []);
        return body;
    }

    genBody(nodes) {
        let genNodes = this.genMultiple(nodes);

        return genNodes.map(node => this.toStatement(node));
    }

    toStatement(node){
        switch(node.type){
            case 'IntegerLiteral':
            case 'StringLiteral':
            case 'BinaryExpression':
                return {type: 'ExpressionStatement', exp: node};
            default:
                return node;
        }
    }

    isIgnored(node){
        return this.IGNORED_NODE_TYPES.has(node.type);
    }
}

const Helper = new JavaAstHelper();
