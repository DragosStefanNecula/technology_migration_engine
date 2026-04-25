const systemPrompt =
`You are an AI migration engine.
You are a fallback to a transpiler migrating Perl Catalyst to Java Spring MVC controllers.

## Responsibilities
- Interpret the information and produce a precise output.
- Use ONLY the provided context.
- Do NOT hallucinate missing data, if something is absent, consider it.
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
Improve the output by analysing both the sourceContext and the firstPass.`,
    HotTip: `## Context Information
You are helping the user by providing one last insight about the migration.
This could be a show of confidence if you think the migration went well, or a list of things to watch out for where it didn't.`
};

// OUTPUT INFO

const codeOutput =
`## Output
- Return the processed result as plain text.
- Don't include the language it was transpiled to.
- Don't include any backticks or quote
- Only include the code snippet for the code provided in the input, not for the whole context
- Don't try to extrapolate what comes next after the code snippet, just focus on the piece of code you have been given to migrate
- If the task cannot be completed, return: ERROR: <reason>`

const textOutput = 
`## Output
- Return the processed result as plain text.
- Don't include any backticks or quotes.
- Don't include any symbols used for formatting such as * or others.
- Keep to about 5 numbered bulletpoints at most, with space between them.
- The first line is a short summary.
- If the task cannot be completed, return: ERROR: <reason>`

const outputPrompt = {
    GenNode: codeOutput,
    MethodInvocation: codeOutput,
    FullBlock: codeOutput,
    HotTip: textOutput
};

// INPUT INFO

const baseNode = `## Input
You will receive:
1. sourceContext: Original input data
2. runningContext: Accumulated outputs from previous nodes
3. node: Current node configuration

## Rules
- Prefer sourceContext over runningContext when conflicts arise.
- Understand the node information well.
- Output ONLY the result, no explanations unless explicitly requested.`

const fullBlock = `## Input
You will receive:
1. sourceContext: Original input data
2. firstPass: The first attempt at a migration based on transpiler and large language model processing.

## Rules
- Prefer sourceContext over runningContext when conflicts arise.
- Understand the context information well.
- Output ONLY the result, no explanations unless explicitly requested.`

const hotTip = `## Input
You will receive:
1. sourceContext: Original input data
2. finalText: The final result of the transpiler and large language model pipeline.

## Rules
- Understand the context information well.`

const inputInfo = {
    GenNode: baseNode,
    MethodInvocation: baseNode,
    FullBlock: fullBlock,
    HotTip: hotTip
};

// EXPORTS

export function processNodeWithAiPrompt(sourceContext, runningContext, node) {
const type = node.type;
return systemPrompt + '\n'
+ contextInfo[type] + '\n'
+ outputPrompt[type] + '\n'
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
+ outputPrompt["FullBlock"] + '\n'
+ inputInfo["FullBlock"] + '\n'
+ `## sourceContext
${sourceContext}\n
## firstPass
${firstPassText}\n`
}

export function processTextWithAiPrompt(sourceContext, finalText){
return systemPrompt + '\n'
+ contextInfo["HotTip"] + '\n'
+ outputPrompt["HotTip"] + '\n'
+ inputInfo["HotTip"] + '\n'
+ `## sourceContext
${sourceContext}\n
## finalText
${finalText}\n`
}