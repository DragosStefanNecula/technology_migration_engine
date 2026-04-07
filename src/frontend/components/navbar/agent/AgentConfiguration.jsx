import { useState, useEffect } from "react";
import Button from "../../base/Button";

export default function AgentConfiguration({ config, setConfig }) {

    const updateField = (field, value) =>
        setConfig(prev => ({ ...prev, [field]: value }));

    return (
        <>
            <div className="form-container">
                <div className="form-group">
                    <label>Name</label>
                    <input
                        value={config.name}
                        onChange={(e) => updateField("name", e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Endpoint URL</label>
                    <input
                        value={config.url}
                        onChange={(e) => updateField("url", e.target.value)}
                    />
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
                />

                <BodyEditor
                    value={config.requestBody}
                    onChange={(body) => updateField("requestBody", body)}
                />

                <div className="form-group">
                    <label>Response Field Path</label>
                    <input
                        value={config.responsePath}
                        onChange={(e) => updateField("responsePath", e.target.value)}
                        placeholder="e.g. choices[0].message.content"
                    />
                    <p className="helper-text">
                        Type the path to the AI response in the JSON response.
                    </p>
                </div>
            </div>
        </>
    );
}

function HeadersEditor({ headers, onChange }) {
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
                        value={h.key}
                        onChange={(e) => update(i, "key", e.target.value)}
                    />
                    <input
                        placeholder="Header Value"
                        value={h.value}
                        onChange={(e) => update(i, "value", e.target.value)}
                    />
                    <Button
                        variant="red"
                        onClick={() => removeHeader(i)}
                    >
                        Remove
                    </Button>
                </div>
            ))}

            <Button onClick={addHeader}>
                Add Header
            </Button>
        </div>
    );
}

function BodyEditor({ value, onChange }) {
    return (
        <div className="form-group">
            <div className="section-title">Request Body</div>
            <p className="helper-text">
                Insert <code>{"{{PROMPT}}"}</code> where the user's prompt should go.
            </p>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}