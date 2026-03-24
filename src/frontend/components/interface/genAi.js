const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function genAi(){
    await delay(2000);
    return "text";
}