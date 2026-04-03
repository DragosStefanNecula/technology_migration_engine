export async function firstPassGenAi(sourceContext, runningContext, node, selectedAgent){
  const result = await window.aiAPI.firstPassGenAi(sourceContext, runningContext, node, selectedAgent);
  return result;
}

export async function secondPassGenAi(sourceContext, firstPassText, selectedAgent){
  const result = await window.aiAPI.secondPassGenAi(sourceContext, firstPassText, selectedAgent);
  return result;
}

export async function textGenAi(sourceContext, finalText, selectedAgent){
  const result = await window.aiAPI.hotTipGenAi(sourceContext, finalText, selectedAgent);
  return result;
}