import { handlePerl } from "#src/backend/components/migrationLogic.js";

export function handleFileUpload(code) {
    return handlePerl(code);
}