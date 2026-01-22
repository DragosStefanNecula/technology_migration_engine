export function genJavaAst(astRoot){
    return gen(astRoot);
}

function gen(node){

    if(node.type === "source_file"){
        return {
            type: "blockStatement",
            body: _generateBody(node)
        }
    }

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
                    body: _generateBody(child, paramAssignment)
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

    if(node.type === "block" || node.type === "standalone_block"){
        return {
            type: "blockStatement",
            body: _generateBody(node)
        }
    }

    if(node.type === ";" || node.type === "{" || node.type === "}"){
        return;
    }

    return node;
}

function _toStatement(node){
    switch(node.type){
        case 'integerLiteral':
        case 'stringLiteral':
            return {type: 'expressionStatement', exp: node};
        default:
            return node;
    }
}

function _removeQuotes(text) {
  if (typeof text !== "string") return text;

  return text.replace(/^(['"])(.*)\1$/, "$2");
}

function _generateBody(node, paramsNode){
    const body = node.children.reduce((acc, child) => {
        const generated = gen(child);
        if (generated !== undefined && !(paramsNode && child == paramsNode)) {
            acc.push(_toStatement(generated));
        }
        return acc;
    }, []);
    return body;
}