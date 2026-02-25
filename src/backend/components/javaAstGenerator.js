import { unknownNodePrompt } from "./promptsLLM.js";

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

    if(node.type === "function_definition")
    {
        let processedNode = {
            type: "FunctionDefinition",
            definition: Helper.removeQuotes(node.children[1].text)
        }

        for (const child of node.children)
        {
            if(child.type === "function_attribute")
            {
                let attrName = child.children[1].text.toLowerCase();
                let functionSignature = child.children[2];
                let attrValue = Helper.removeQuotes(functionSignature.children.find(n => n.text !== "(" && n.text !== ")" && n.text !== `"` && n.text !== `'`)?.text);
                processedNode[attrName] = attrValue || -1;
            }

            if(child.type === "block"){
                const paramAssignment = child.children.find(n => n.type === "binary_expression" && n.children.some(c => c.type === "array_variable" && c.text === "@_"));
                processedNode["block"] = {
                    type: "BlockStatement",
                    body: Helper.genBody(child.children, paramAssignment)
                };
                if (paramAssignment) {
                processedNode["params"] = paramAssignment.children
                    .find(c => c.type === "variable_declaration")?.children
                    .find(c => c.type === "multi_var_declaration")?.children
                    .filter(c => c.type === "scalar_variable" || c.type === "array_variable")
                    .map(c => c.text.slice(1)) || [];
                }
            }
        }
        return processedNode;
    }

    if(node.type === "if_statement"){
        return {
            type: "IfStatement",
            condition: gen(node.children[1]),
            block: gen(node.children[2]),
            alternativeClauses: Helper.genMultiple(node.children.slice(3))
        }
    }

    if(node.type === "elsif_clause"){
        return {
            type: "ElsifStatement",
            condition: gen(node.children[1]),
            block: gen(node.children[2])
        }
    }

    if(node.type === "else_clause"){
        return {
            type: "ElseStatement",
            block: gen(node.children[1])
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
                    return{
                        type: "ArrayAssignmentDeclaration",
                        arrayAssignment: Helper.variable_ArrayAssignment(declaredVariable, right)
                    }
                }

                if(declaredVariable.type === "hash_variable"){
                    return{
                        type: "HashAssignmentDeclaration",
                        hashAssignment: Helper.variable_HashAssignment(declaredVariable, right)
                    }
                }
            }
            if(left.type === "array_variable"){
                return Helper.variable_ArrayAssignment(left, right, true)
            }
            if(left.type === "hash_variable"){
                return Helper.variable_HashAssignment(left, right)
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

    if (node.type === "scalar_variable" || node.type === "array_variable" || node.type === "hash_variable") {
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

        if(identifier === "delete"){
            return{
                type: "DeleteHash",
                hashAccess: gen(node.children[1])
            }
        }

        if(identifier === "exists"){
            return{
                type: "ContainsHash",
                hashAccess: gen(node.children[1])
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
            return Helper.variable_HashDeclaration(declaredVariable);
        }

        if(declaredVariable.type === "array_variable"){
            return Helper.variable_ArrayDeclaration(declaredVariable);
        }
    }

    if(node.type === "hash_access_variable"){
        return{
            type: "HashAccess",
            identifier: Helper.stripVariableName(node.children[0]),
            key: Helper.stripQuotes(node.children[2].text)
        }
    }

    if(node.type === "array_access_variable"){
        return {
            type:"ArrayAccessVariable",
            identifier: Helper.stripVariableName(node.children[0]),
            index: node.children[2].text
        }
    }

    if(node.type === "array_function_remove" || node.type === "array_function_reverse"){
        const type = node.children[0].type;

        if(type === "pop"){
            return {
                type: "ArrayFunctionPop",
                arrayIdentifier: Helper.stripVariableName(node.children[1])
            }
        }

        if(type === "shift"){
            return {
                type: "ArrayFunctionShift",
                arrayIdentifier: Helper.stripVariableName(node.children[1])
            }
        }

        if(type === "reverse"){
            return {
                type: "ArrayFunctionReverse",
                arrayIdentifier: Helper.stripVariableName(node.children[1])
            }        
        }
    }

    if(node.type === "array_function_add"){
        const type = node.children[0].type;
        const array = node.children.splice(2);
        
        if(type === "push")
        {
            return {
                type: "ArrayFunctionPush",
                arrayIdentifier: Helper.stripVariableName(node.children[1]),
                arrayElements: Helper.genMultiple(Helper.variable_unpackArrayAssignment(array))
            }
        }

        if(type === "unshift"){
            return {
                type: "ArrayFunctionUnshift",
                arrayIdentifier: Helper.stripVariableName(node.children[1]),
                arrayElements: Helper.genMultiple(Helper.variable_unpackArrayAssignment(array))
            }
        }
    }

    const err = new Error(unknownNodePrompt);
    err.name = "GenNode";
    throw err;
}

class JavaAstHelper{
    constructor() {
        this.IGNORED_NODE_TYPES = new Set([";", "{", "}", ",", "normal_comma"]);

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

    genMultiple(nodes, excludeNode = null) {
        if (!nodes) return [];

        return nodes.flatMap(child => {
            if (excludeNode && child == excludeNode) {
                return [];
            }
            
            try {
                const generated = gen(child);
                return generated === undefined ? [] : generated;
            } catch (error) {
                return{
                    type: error.name,
                    prompt: error.message,
                    content: child.text
                }

            }
        });
    }

    genBody(nodes, excludeNode = null) {
        return this
            .genMultiple(nodes, excludeNode)
            .map(node => this.toStatement(node));
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
            case 'ScalarVariableDeclaration':
            case 'ArrayAssignmentDeclaration':
            case 'HashAssignmentDeclaration':
            case 'ArrayAssignment':
            case 'HashAssignment':
            case 'HashAccess':
            case 'HashDeclaration':
            case 'DeleteHash':
            case 'ContainsHash':
            case 'ArrayDeclaration':
            case 'ArrayAccessVariable':
            case 'ArrayFunctionPop':
            case 'ArrayFunctionReverse':
            case 'ArrayFunctionShift':
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

    removeQuotes(text) {
        if (typeof text !== "string") return text;

        return text.replace(/^(['"])(.*)\1$/, "$2");
    }

    stripQuotes(input) {
        if (typeof input !== "string") return input; // Return as-is if not a string
        return input.replace(/^["']|["']$/g, '');
    }

    filterNodesByTypes(nodes = [], allowedTypes = [], excludedTypes = []) {
        const results = [];

        const allowedTypesSet = new Set(allowedTypes);
        const excludedTypesSet = new Set(excludedTypes);

        for (const node of nodes) {
            const type = node.type;

            if (
                (allowedTypesSet.size === 0 || allowedTypesSet.has(type)) &&
                (excludedTypesSet.size === 0 || !excludedTypesSet.has(type))
            ) {
                results.push(node);
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

    variable_ArrayAssignment(node, assignment){
        return{
            type: "ArrayAssignment",
            identifier: this.stripVariableName(node),
            assignment: this.genMultiple(this.variable_unpackArrayAssignment(assignment.children)),
        }
    }

    variable_unpackArrayAssignment(array){
        return this.filterNodesByTypes(array, [], ["(", ",", "normal_comma", ")", ";"]);
    }

    variable_HashDeclaration(node){
        return{
            type: "HashDeclaration",
            identifier: this.stripVariableName(node)
        }
    }

    variable_HashAssignment(node, assignment){
        return{
            type: "HashAssignment",
            identifier: this.stripVariableName(node),
            assignment: this.variable_unpackHashAssignment(assignment.children)
        }
    }

    variable_unpackHashAssignment(array){
        const filteredNodes = this.filterNodesByTypes(array, [], ["(", ",", "fat_comma", "normal_comma", ")"]);

        const result = {};
        
        for (let i = 0; i < filteredNodes.length; i += 2) {
            const keyNode = filteredNodes[i];
            const valueNode = filteredNodes[i + 1];

            if (!keyNode || !valueNode) continue;

            const key = this.stripQuotes(keyNode.text);

            let value = gen(valueNode);

            result[key] = value;
        }

        return result;
    }
}

const Helper = new JavaAstHelper();
