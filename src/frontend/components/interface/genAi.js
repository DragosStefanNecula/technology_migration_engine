export async function genAi(sourceContext, runningContext, node){
  const result = await window.aiAPI.genAi(sourceContext, runningContext, node);
  return result;
}
