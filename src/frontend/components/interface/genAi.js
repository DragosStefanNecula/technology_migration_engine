export async function genAi(sourceContext, runningContext, node, selectedAgent){
  const result = await window.aiAPI.genAi(sourceContext, runningContext, node, selectedAgent);
  return result;
}
