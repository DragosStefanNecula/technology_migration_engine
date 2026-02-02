
export function genJavaAst(astRoot){
    return gen(astRoot);
}

function gen(node){

    // STRUCTURAL ELEMENTS

    if(node.type === "source_file"){
        return {
            type: "blockStatement",
            body: _generateBody(node.children)
        }
    }

    if(node.type === "function_definition")
    {
        let processedNode = {
            type: "functionDefinition",
            definition: _removeQuotes(node.children[1].text)
        }

        for (const child of node.children)
        {
            if(child.type === "function_attribute")
            {
                let attrName = child.children[1].text.toLowerCase();
                let functionSignature = child.children[2];
                let attrValue = _removeQuotes(functionSignature.children.find(n => n.text !== "(" && n.text !== ")" && n.text !== `"` && n.text !== `'`)?.text);
                processedNode[attrName] = attrValue || -1;
            }

            if(child.type === "block"){
                const paramAssignment = child.children.find(n => n.type === "binary_expression" && n.children.some(c => c.type === "array_variable" && c.text === "@_"));
                processedNode["block"] = {
                    type: "blockStatement",
                    body: _generateBody(child.children, paramAssignment)
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

    if(node.type === "while_statement"){
        return {
            type: "whileStatement",
            arguments: node.children[1],
            body: _generateBody(node.children[2].children)
        }
    }

    if(node.type === "for_statement_1"){
        const separatedElements = _separateExpressions(node.children);
        return {
            type: "forStatement1",
            declaration: separatedElements.expressions[0],
            condition: separatedElements.expressions[1],
            increment: separatedElements.expressions[2],
            body: _generateBody(separatedElements.body.children)
        }
    }

    if(node.type === "for_statement_2")
    {
        const separatedElements = _separateExpressions(node)
    }

    if(node.type === "block" || node.type === "standalone_block"){
        return {
            type: "blockStatement",
            body: _generateBody(node.children)
        }
    }

    // STATEMENT ELEMENTS

    if(node.type === "integer"){
        return {
            type: "integerLiteral",
            value: node.text
        }
    }

    if(node.type === "string_single_quoted" || node.type === "string_double_quoted"){
        return {
            type: "stringLiteral",
            value: node.text
        }
    }

    if (node.type === "binary_expression") {
        try {
            return {
                type: "binaryExpression",
                left: gen(node.children[0]),
                operator: gen(node.children[1]),
                right: gen(node.children[2])
            };
        } catch (error) {

        }
    }

    if (node.type in BINARY_OPERATOR_MAP) {
        const mapped = BINARY_OPERATOR_MAP[node.text];

        if (!mapped) {
            throw new Error(`Unsupported operator: ${node.text}`);
        }

        return {
            type: "operator",
            value: mapped
        };
    }

    if(node.type === "variable_declaration"){
        return {
            type: "variableDeclaration",
            value: gen(node.children[1])
        }
    }

    if (node.type === "scalar_variable") {
        return {
            type: "identifier",
            name: node.text.slice(1)
        };
    }
    
    if (node.type === 'identifier')
        return {
            type: "identifier",
            name: node.text
        }

    if (node.type === "call_expression"){
        return {
            type: "callExpression",
            identifier: gen(node.children[0]),
            arguments: gen(node.children[1])
        }
    }

    if(node.type === "parenthesized_argument"){
        let parameters = node.children[1];
        return {
            type: "arguments",
            body: _generateBody(_extractExpressions(parameters.children, ["normal_comma", ")", "("]))
        }
    }

    if(node.type === "single_line_statement")
    {
        return {
            type: "codeGen",
            content: node.text
        }
    }

    if(node.type === ";" || node.type === "{" || node.type === "}" || node.type === "comments"){
        return;
    }

    throw new Error("UseCodeGen");
}

function _toStatement(node){
    switch(node.type){
        case 'integerLiteral':
        case 'stringLiteral':
        case 'binaryExpression':
            return {type: 'expressionStatement', exp: node};
        default:
            return node;
    }
}

function _removeQuotes(text) {
  if (typeof text !== "string") return text;

  return text.replace(/^(['"])(.*)\1$/, "$2");
}

function _generateBody(nodes, paramsNode){
    console.log(nodes)
    if(!nodes) return;
    const body = nodes.reduce((acc, child) => {
        const generated = gen(child);
        if (generated !== undefined && !(paramsNode && child == paramsNode)) {
            acc.push(_toStatement(generated));
        }
        return acc;
    }, []);
    return body;
}

function _separateExpressions(nodes) {
    const expressions = [];
    let body;

    for (const node of nodes) {
        if (
        node.type === "unary_expression" ||
        node.type === "binary_expression"
        ) {
            expressions.push(node);
        } else if (node.type === "block") {
            body = node;
        }
    }

    return { expressions, body };
}

function _extractExpressions(nodes, excludedTypes = [], includedTypes = []){
    let extractedNodes = []
    for (const node of nodes)
    {
        if((excludedTypes.length > 0 && !excludedTypes.includes(node.type)) || (includedTypes.length > 0 && includedTypes.includes(node.type)))
        {
            extractedNodes.push(node);
        }
    }
    return extractedNodes;
}

const BINARY_OPERATOR_MAP = {
    "+": "+",
    "-": "-",
    "*": "*",
    "/": "/",
    "%": "%",
    "**": "POW",
    "==": "==",
    "!=": "!=",
    "<": "<",
    "<=": "<=",
    ">": ">",
    ">=": ">=",
    "eq": "STRING_EQ",
    "ne": "STRING_NE",
    "&&": "&&",
    "||": "||",
    "=": "=",
};