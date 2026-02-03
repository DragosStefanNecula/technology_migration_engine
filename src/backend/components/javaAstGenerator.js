
export function genJavaAst(astRoot){
    return gen(astRoot);
}

function gen(node){
    if(node.type === "source_file"){
        return {
            type: "BlockStatement",
            body: node.children
        }
    }
}