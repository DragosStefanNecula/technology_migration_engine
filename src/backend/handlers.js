import { handlePerl } from "./components/migrationLogic.js";

export function handleFileUpload(code){
    return handlePerl(code);
}