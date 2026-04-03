const systemPrompt =
`You are an AI migration engine.
You are a fallback to a transpiler migrating Perl Catalyst to Java Spring MVC controllers.

## Responsibilities
- Interpret the information and produce a precise output.
- Use ONLY the provided context.
- Do NOT hallucinate missing data—if something is absent, consider it.
- Be concise and structured.`

// CONTEXT INFO

const contextInfo = {
    GenNode: `## Context Information
You are processing an unknown node. 
The transpiler has ran into a case that it doesn't know how to handle.`,
    MethodInvocation: `## Context Information
You are processing a method invocation node.
The transpiler has ran into a case that it doesn't know how to handle.`,
    FullBlock: `## Context Information
You are processing a full block of code that has been migrated once.
Improve the output by analysing both the sourceContext and the firstPass.`
};

// OUTPUT INFO

const outputPrompt =
`## Output
- Return the processed result as plain text.
- Don't include the language it was transpiled to.
- Don't include any backticks or quotes.
- If the task cannot be completed, return: ERROR: <reason>`

// INPUT INFO

const baseNode = `## Input
You will receive:
1. sourceContext: Original input data
2. runningContext: Accumulated outputs from previous nodes
3. node: Current node configuration

## Rules
- Prefer sourceContext over runningContext when conflicts arise.
- Understand the node information well.
- Output ONLY the result—no explanations unless explicitly requested.`

const fullBlock = `## Input
You will receive:
1. sourceContext: Original input data
2. firstPass: The first attempt at a migration based on transpiler and large language model processing.

## Rules
- Prefer sourceContext over runningContext when conflicts arise.
- Understand the context information well.
- Output ONLY the result—no explanations unless explicitly requested.`

const inputInfo = {
    GenNode: baseNode,
    MethodInvocation: baseNode,
    FullBlock: fullBlock
};

// EXPORTS

export function processNodeWithAiPrompt(sourceContext, runningContext, node) {
const type = node.nodeType;
return systemPrompt + '\n'
+ contextInfo[type] + '\n'
+ outputPrompt + '\n'
+ inputInfo[type] + '\n'
+ `## sourceContext
${sourceContext}\n
## runningContext
${runningContext}\n
## node
${node.value}\n`
}

export function processBlockWithAiPrompt(sourceContext, firstPassText) {
return systemPrompt + '\n'
+ contextInfo["FullBlock"] + '\n'
+ outputPrompt + '\n'
+ inputInfo["FullBlock"] + '\n'
+ `## sourceContext
${sourceContext}\n
## firstPass
${firstPassText}\n`
}