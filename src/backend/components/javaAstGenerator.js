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

    if(node.type === "string_single_quoted" || node.type === "string_double_quoted"){
        return {
            type: "StringLiteral",
            value: node.text
        }
    }

    if(node.type === "binary_expression"){
        return {
            type: "BinaryExpression",
            left: gen(node.children[0]),
            operator: gen(node.children[1]),
            right: gen(node.children[2])
        }
    }

    if (node.type in Helper.BINARY_OPERATOR_MAP) {
        const mapped = Helper.BINARY_OPERATOR_MAP[node.text];

        if (!mapped) {
            throw new Error(`Unsupported operator: ${node.text}`);
        }

        return {
            type: "Operator",
            value: mapped
        };
    }

    if (node.type === "scalar_variable") {
        return {
            type: "Identifier",
            name: Helper.stripVariable(node)
        };
    }
}

class JavaAstHelper{
    constructor() {
        this.IGNORED_NODE_TYPES = new Set([";", "{", "}"]);

        this.BINARY_OPERATOR_MAP = {
            "+": "+",
            "-": "-",
            "*": "*",
            "/": "/",
            "%": "%",
            "==": "==",
            "!=": "!=",
            "<": "<",
            "<=": "<=",
            ">": ">",
            ">=": ">=",
            "&&": "&&",
            "||": "||",
            "=": "=",
            "**": "POW",
            "eq": "STRING_EQ",
            "ne": "STRING_NE",
        };
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

    stripVariable(node){
        return node.text.slice(1);
    }
}

const Helper = new JavaAstHelper();
