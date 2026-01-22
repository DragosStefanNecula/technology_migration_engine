export function genJavaAst(astRoot){
    return gen(astRoot);
}

function gen(node){

    if(node.type === "source_file"){
        const body = node.children.reduce((acc, child) => {
            const generated = gen(child);
            if (generated !== undefined) {
                acc.push(_toStatement(generated));
            }
            return acc;
        }, []);

        return {
            type: 'ordinaryCompilationUnit',
            body: body
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
            definition: _removeQuotes(node.children[1].text)
        }

        for (const child of node.children)
        {
            if(child.type === "function_attribute")
            {
                let attrName = child.children[1].text.toLowerCase();
                let functionSignature = child.children[2];
                let attrValue = _removeQuotes(functionSignature.children.find(n => n.text !== "(" && n.text !== ")" && n.text !== `"` && n.text !== `'`)?.text);
                processedNode[attrName] = attrValue || null;
            }

            if(child.type === "block"){
                processedNode["block"] = gen(child);
            }
        }
        return processedNode;
    }

    if(node.type === "block" || node.type === "standalone_block"){

        const body = node.children.reduce((acc, child) => {
            const generated = gen(child);
            if (generated !== undefined) {
                acc.push(_toStatement(generated));
            }
            return acc;
        }, []);
        
        return {
            type: "blockStatement",
            body
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