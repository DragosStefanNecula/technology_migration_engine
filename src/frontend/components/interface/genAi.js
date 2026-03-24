const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function genAi(sourceContext, runningContext, node){
    //TODO: Error handling too
    await delay(2000);
    return "text";
}

// 1. Parameters: context, node (prompt, value)