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

    if(node.type === "block" || node.type === "standalone_block"){
        return {
            type: "BlockStatement",
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

    if(node.type === "unary_expression"){
        if(node.children[0].type === "!" || node.children[0].type === "not"){
            return {
                type: "NegativeExpression",
                right: gen(node.children[1]),
                operator: gen(node.children[0])
            }
        }
        return {
            type: "UnaryExpression",
            left: gen(node.children[0]),
            operator: gen(node.children[1])
        }
    }

    if(node.type === "binary_expression"){
        const left = node.children[0];
        const operator = node.children[1]; 
        const right = node.children[2];

        if(operator.type === "="){
            if(left.type === "variable_declaration"){
                const declaredVariable = left.children[1];

                if(declaredVariable.type === "array_variable"){
                    return [
                        Helper.variable_ArrayDeclaration(declaredVariable),
                        Helper.variable_ArrayAssignment(declaredVariable, right)
                    ]
                }

                if(declaredVariable.type === "hash_variable"){
                    return {
                        type: "HashDeclarationand"
                    }
                }
            }
            if(left.type === "array_variable"){
                return Helper.variable_ArrayAssignment(left, right, true)
            }
            if(left.type === "hash_variable"){

            }
        }

        return {
            type: "BinaryExpression",
            left: gen(left),
            operator: gen(operator),
            right: gen(right)
        }
    }

    if(node.type === "ternary_expression"){
        return {
            type:"TernaryExpression",
            left: gen(node.children[0]),
            middle: gen(node.children[2]),
            right: gen(node.children[4])
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
            name: Helper.stripVariableName(node)
        };
    }

    if(node.type === "array") {
        return {
            type: "ParanthesizedExpression",
            value: gen(node.children[1])
        }
    }

    if(node.type === "loop_control_statement"){
        return gen(node.children[0])
    }

    if(node.type === "loop_control_keyword"){
        if(node.text === "last"){
            return {
                type: "ControlFlowExpression",
                value: "break"
            }
        }
        if(node.text === "next"){
            return {
                type: "ControlFlowExpression",
                value: "continue"
            }
        }
    }

    if(node.type === "return_expression"){
        let returnedNode = node.children[1];
        return{
            type: "ReturnExpression",
            value: returnedNode ? gen(returnedNode) : undefined
        }
    }

    if(node.type === "call_expression"){
        let identifier = node.children[0].text;
        if(identifier === "die"){
            let methodArguments = node.children[1];
            return {
                type: "ErrorExpression",
                value: gen(methodArguments.children[0])
            }
        }

        return {
            type: "CallExpression",
            identifier: node.children[0].text,
            arg: gen(node.children[1])
        }
    }

    if(node.type === "parenthesized_argument"){
        return {
            type: "ParanthesizedArgument",
            body: Helper.genMultiple(node.children[1].children)
        }
    }

    if(node.type === "arguments"){
        return {
            type: "ParanthesizedArgument",
            body: Helper.genMultiple(node.children)
        }
    }

    // Variable Declaration

    if(node.type === "variable_declaration"){
        const declaredVariable = node.children[1];

        if(declaredVariable.type === "scalar_variable")
        {
            return{ 
                type: "ScalarVariableDeclaration",
                declared: gen(node.children[1])
            }
        }

        if(declaredVariable.type === "hash_variable"){
            /*
                HashMap h = new HashMap();  // raw, completely unchecked

                h.put("name", "Alice");
                h.put(42, true);
                h.put(3.14, new int[]{1, 2, 3});
            */
            return{
                type: "HashVariableDeclaration",
                declared: gen(node.children[1])
            }
        }

        if(declaredVariable.type === "array_variable"){
            return Helper.variable_ArrayDeclaration(declaredVariable);
        }
    }
}

class JavaAstHelper{
    constructor() {
        this.IGNORED_NODE_TYPES = new Set([";", "{", "}", ","]);

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
            ".": "+",
            "**": "POW",
            "eq": "STRING_EQ",
            "ne": "STRING_NE",
            "+=": "+=",
            "-=": "-=",
            "*=": "*=",
            "/=": "/=",
            "++": "++",
            "--": "--",
            "!": "!",
            "not": "!",
            "and": "&&",
            "or": "||"
        };
    }

    genMultiple(nodes) {
        if (!nodes) return [];

        return nodes.flatMap(child => {
            const generated = gen(child);
            return generated === undefined ? [] : generated;
        });
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
            case 'TernaryExpression':
            case 'UnaryExpression':
            case 'NegativeExpression':
            case 'ControlFlowExpression':
            case 'ReturnExpression':
            case 'ErrorExpression':
            case 'CallExpression':
                return {type: 'ExpressionStatement', exp: node};
            default:
                return node;
        }
    }

    isIgnored(node){
        return this.IGNORED_NODE_TYPES.has(node.type);
    }

    stripVariableName(node){
        return node.text.slice(1);
    }

    findChildrenOfTypes(node, allowedTypes, excludedTypes) {
        const results = [];

        // Sets for constant time look-up
        const allowedTypesSet = new Set(allowedTypes);
        const excludedTypesSet = new Set(excludedTypes);

        // Only check immediate children
        if (node.children?.length) { 
            for (const child of node.children) {
                const type = child.type;
                if ((allowedTypesSet.size === 0 || allowedTypesSet.has(type)) &&
                    (excludedTypesSet.size === 0 || !excludedTypesSet.has(type))) {
                    results.push(child);
                }
            }
        }

        return results;
    }

    isAssignmentOperator(op) {
        return [
            "=", "+=", "-=", "*=", "/=", "%=",
            "||=", "&&=", "|=", "&=", "^=",
            "<<=", ">>="
        ].includes(op);
    }

    isOfType(node, type){
        return node.type === type;
    }

    // Arrays & Hashes

    variable_ArrayDeclaration(node){
        return{
            type: "ArrayDeclaration",
            identifier: this.stripVariableName(node)
        }
    }

    variable_ArrayAssignment(node, assignment, clear){
        return{
            type: "ArrayAssignment",
            identifier: this.stripVariableName(node),
            assignment: this.genMultiple(this.variable_unpackArrayAssignment(assignment)),
            clear: clear ? true : false
        }
    }

    variable_unpackArrayAssignment(node){
        return this.findChildrenOfTypes(node, [], ["(", ",", ")"]);
    }
}

const Helper = new JavaAstHelper();
