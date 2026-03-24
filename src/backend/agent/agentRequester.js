import { systemPrompt } from "./prompts.js";
export async function processNodeWithAi(sourceContext, runningContext, node) {
    const prompt = systemPrompt + node.prompt + 
`## sourceContext
${sourceContext}
## runningContext
${runningContext}
## node
${node.value}`

    // return await sendtoai(prompt, agent);
    
    return `Processed: ${node.value}`; 
}