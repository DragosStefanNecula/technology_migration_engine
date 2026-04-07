export function validateAgentConfig({ config = {}, options = [], originalName = "" }) {
    return {
        name: validateName(config.name, options, originalName),
        requestBody: validateRequestBody(config.requestBody || ""),
        responsePath: validateResponsePath(config.responsePath || "")
    };
}


export function validateName(name, options = [], originalName = "") {
    const nextName = normalize(name);
    const currentName = normalize(originalName);
    
    if (!nextName) return "";
    
    const getOptionName = (option) => normalize(option?.label);
    const alreadyExists = options.some((option) => {
        const optionName = getOptionName(option);
        return optionName && optionName !== currentName && optionName === nextName;
    });
    
    return alreadyExists ? "An agent with this name already exists." : "";
}

const PROMPT_TOKEN = "{{PROMPT}}";
export function validateRequestBody(requestBody = "") {
    if (!requestBody.includes(PROMPT_TOKEN)) {
        return `Request body must include ${PROMPT_TOKEN}.`;
    }
    
    try {
        JSON.parse(requestBody);
        return "";
    } catch {
        return "Request body must be valid JSON.";
    }
}

const RESPONSE_PATH_REGEX = /^[A-Za-z_$][\w$]*(\[\d+\])*(\.[A-Za-z_$][\w$]*(\[\d+\])*)*$/;
export function validateResponsePath(responsePath = "") {
    const path = responsePath.trim();
    
    if (!path) return "Response field path is required.";
    if (!RESPONSE_PATH_REGEX.test(path)) return "Response field path is invalid.";
    return "";
}

export function hasValidationErrors(errors = {}) {
    return Object.values(errors).some(Boolean);
}

const normalize = (value) => (value || "").trim().toLowerCase();