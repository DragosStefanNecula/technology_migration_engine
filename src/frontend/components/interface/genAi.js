const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function genAi(finalText){
    //TODO: Error handling too
    await delay(2000);
    return "text";
}