export function genJavaAst(astRoot){
    return gen(astRoot);
}

function gen(node){

    if(node.type === "source_file"){
        let body = [];
        
        node.children.forEach(child => {
            body.push(gen(child));
        });

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

    return node;
}
