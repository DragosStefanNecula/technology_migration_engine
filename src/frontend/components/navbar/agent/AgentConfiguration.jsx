import Button from "#src/frontend/components/base/Button";
import { SmartTooltip } from "#src/frontend/components/base/SmartTooltip";
import "#src/frontend/components/navbar/agent/AgentConfiguration.css";

//[[req6impl| ]] Adheres to [[#req6spec|Requirement 6]]

export default function AgentConfiguration({
    config,
    setConfig,
    validationErrors = {},
    templateHintsEnabled = false
}) {
    const updateField = (field, value) => setConfig(prev => ({ ...prev, [field]: value }));

    return (
        <>
            <div className="form-container">
                <div className="form-group">
                    <label>Name</label>
                    <input
                        className={validationErrors.name ? "input-error" : ""}
                        value={config.name}
                        onChange={(e) => updateField("name", e.target.value)}
                    />
                    {validationErrors.name && (
                        <p className="field-error-text">{validationErrors.name}</p>
                    )}
                </div>

                <div className="form-group">
                    <label>Endpoint URL</label>
                    <HintTooltip value={config.url} enabled={templateHintsEnabled}>
                        <input
                            className={hintClass(config.url, templateHintsEnabled)}
                            value={config.url}
                            onChange={(e) => updateField("url", e.target.value)}
                        />
                    </HintTooltip>
                </div>

                <div className="form-group">
                    <label>Method</label>
                    <select
                        value={config.method}
                        onChange={(e) => updateField("method", e.target.value)}
                    >
                        <option value="POST">POST</option>
                        <option value="GET">GET</option>
                    </select>
                </div>

                <HeadersEditor
                    headers={config.headers}
                    onChange={(headers) => updateField("headers", headers)}
                    templateHintsEnabled={templateHintsEnabled}
                />

                <BodyEditor
                    value={config.requestBody}
                    onChange={(body) => updateField("requestBody", body)}
                    error={validationErrors.requestBody}
                    templateHintsEnabled={templateHintsEnabled}
                />

                <div className="form-group">
                    <label>Response Field Path</label>
                    <input
                        className={validationErrors.responsePath ? "input-error" : ""}
                        value={config.responsePath}
                        onChange={(e) => updateField("responsePath", e.target.value)}
                        placeholder="e.g. choices[0].message.content"
                    />
                    {validationErrors.responsePath && (
                        <p className="field-error-text">{validationErrors.responsePath}</p>
                    )}
                    <p className="helper-text">
                        Type the path to the AI response in the JSON response.
                    </p>
                </div>
            </div>
        </>
    );
}

function HeadersEditor({ headers, onChange, templateHintsEnabled }) {
    const update = (index, field, value) => {
        const next = [...headers];
        next[index][field] = value;
        onChange(next);
    };

    const addHeader = () =>
        onChange([...headers, { key: "", value: "" }]);

    const removeHeader = (index) =>
        onChange(headers.filter((_, i) => i !== index));

    return (
        <div className="form-group">
            <div className="section-title">Headers</div>

            {headers.map((h, i) => (
                <div className="header-item" key={i}>
                    <input
                        placeholder="Header Name"
                        className={hintClass(h.key, templateHintsEnabled)}
                        value={h.key}
                        onChange={(e) => update(i, "key", e.target.value)}
                    />
                    <HintTooltip value={h.value} enabled={templateHintsEnabled}>
                        <input
                            placeholder="Header Value"
                            className={hintClass(h.value, templateHintsEnabled)}
                            value={h.value}
                            onChange={(e) => update(i, "value", e.target.value)}
                        />
                    </HintTooltip>
                    <Button variant="red" onClick={() => removeHeader(i)}>
                        Remove
                    </Button>
                </div>
            ))}

            <Button onClick={addHeader}>Add Header</Button>
        </div>
    );
}

function BodyEditor({ value, onChange, error, templateHintsEnabled }) {
    return (
        <div className="form-group">
            <div className="section-title">Request Body</div>
            <p className="helper-text">
                Insert<code>{"{{PROMPT}}"}</code>anywhere the user's message should appear. When the request is sent,
                this placeholder is replaced with the actual prompt text, usually inside a JSON string value such as 
                <code>{`"prompt": "{{PROMPT}}"`}</code>.
            </p>
            <HintTooltip value={value} enabled={templateHintsEnabled}>
                <textarea
                    className={`${error ? "input-error " : ""}${hintClass(value, templateHintsEnabled)}`.trim()}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </HintTooltip>
            {error && <p className="field-error-text">{error}</p>}
        </div>
    );
}

function HintTooltip({ value, enabled, children }) {
    const placeholders = getTemplatePlaceholders(value);
    const active = enabled && placeholders.length > 0;

    return (
        <SmartTooltip
            disabled={!active}
            content={`Replace template placeholder(s): ${placeholders.join(", ")}`}
        >
            {children}
        </SmartTooltip>
    );
}

function hintClass(value, enabled) {
    return enabled && getTemplatePlaceholders(value).length > 0 ? "agent-template-highlight" : "";
}

function getTemplatePlaceholders(value) {
    const matches = (value || "").match(/\bYOUR_[A-Z0-9_]+\b/g);
    return [...new Set(matches || [])];
}