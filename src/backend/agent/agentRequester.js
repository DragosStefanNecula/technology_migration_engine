export async function processNodeWithAi(sourceContext, runningContext, node) {
    console.log(node);
    
    const text = node.value; 
    return `Processed: ${text}`; 
}