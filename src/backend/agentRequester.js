export async function processNodeWithAi(sourceContext, runningContext, node) {
    const text = node.value; 
    return `Processed: ${text}`; 
}