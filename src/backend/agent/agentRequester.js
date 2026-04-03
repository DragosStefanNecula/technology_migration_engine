import { processBlockWithAiPrompt, processNodeWithAiPrompt, processTextWithAiPrompt } from "./prompts.js";
import Store from 'electron-store';
const store = new Store();

// PROCESS FUNCTIONS

export async function processNodeWithAi(sourceContext, runningContext, node, selectedAgent) {
    const prompt = processNodeWithAiPrompt(sourceContext, runningContext, node)

    const existingConfigs = store.get('apiConfigs', {});
    
    return await sendRequest(prompt, existingConfigs[selectedAgent]);
}


export async function processBlockWithAi(sourceContext, firstPassText, selectedAgent){
    const prompt = processBlockWithAiPrompt(sourceContext, firstPassText);

    const existingConfigs = store.get('apiConfigs', {});

    return await sendRequest(prompt, existingConfigs[selectedAgent]); 
}

export async function processTextWithAi(sourceContext, finalText, selectedAgent){
    const prompt = processTextWithAiPrompt(sourceContext, finalText);

    const existingConfigs = store.get('apiConfigs', {});

    return await sendRequest(prompt, existingConfigs[selectedAgent]); 
}

// HELPER FUNCTIONS

async function sendRequest(prompt, config) {
    if (!config) {
        throw new Error('Missing API config');
    }

    let safePrompt = escapeJSONString(prompt);

    let bodyString = config.requestBody.replace('{{PROMPT}}', safePrompt);

    let body;
    try {
        body = JSON.parse(bodyString);
    } catch (err) {
        throw new Error('Invalid JSON in requestBody after prompt injection');
    }
    
    const headers = {};
    for (const h of config.headers || []) {
        headers[h.key] = h.value;
    }

    const response = await fetch(config.url, {
        method: config.method || 'POST',
        headers,
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Request failed: ${response.status} - ${text}`);
    }

    const data = await response.json();

    const result = resolvePath(data, config.responsePath);
    console.log(result)

    return result;
}

// Helper: safely resolve deep paths like "a.b[0].c"
function resolvePath(obj, path) {
    if (!path) return obj;

    return path
        .replace(/\[(\d+)\]/g, '.$1') 
        .split('.')
        .filter(Boolean)
        .reduce((acc, key) => {
            if (acc && key in acc) return acc[key];
            return undefined;
        }, obj);
    }
    
function escapeJSONString(str) {
    return JSON.stringify(str).slice(1, -1);
}