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
            type: 'SourceFile',
            body: body
        }
    }

    if(node.type === "integer"){
        return {
            type: "NumericLiteral",
            value: node.text
        }
    }

    return node;
}
