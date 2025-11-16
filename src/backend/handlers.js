import { parse } from "./components/parser";

export function handleFileUpload(code){
    return parse(code);
}