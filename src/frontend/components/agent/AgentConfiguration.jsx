import { useState, useEffect } from "react";



export default function AgentConfiguration({config, setConfig}) {

  const updateField = (field, value) => setConfig(prev => ({ ...prev, [field]: value }))

  return (
    <div style={{ maxWidth: 800 }}>
      <div>
        <label>Name</label>
        <input value={config.name} onChange={(e) => updateField("name", e.target.value)} />
      </div>

      <div>
        <label>Endpoint URL</label>
        <input value={config.url} onChange={(e) => updateField("url", e.target.value)} />
      </div>

      <div>
        <label>Method</label>
        <select value={config.method} onChange={(e) => updateField("method", e.target.value)}>
          <option value="POST">POST</option>
          <option value="GET">GET</option>
        </select>
      </div>

      <HeadersEditor headers={config.headers} onChange={(headers) => updateField("headers", headers)}/>

      <BodyEditor value={config.requestBody} onChange={(body) => updateField("requestBody", body)}/>

      <div>
        <label>Response Field Path</label>
        <input
          value={config.responsePath}
          onChange={(e) => updateField("responsePath", e.target.value)}
          placeholder="e.g. choices[0].message.content"
        />
        <p style={{ fontSize: 12, color: "#555" }}>
          Type the path to the AI response in the JSON response.
        </p>
      </div>
    </div>
  )
}

function HeadersEditor({ headers, onChange }) {
  const update = (index, field, value) => {
    const next = [...headers]
    next[index][field] = value
    onChange(next)
  }

  const addHeader = () => onChange([...headers, { key: "", value: "" }])
  const removeHeader = (index) => onChange(headers.filter((_, i) => i !== index))

  return (
    <div>
      <h3>Headers</h3>
      {headers.map((h, i) => (
        <div key={i} style={{ display: "flex", gap: 8 }}>
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
          <button onClick={() => removeHeader(i)}>Remove</button>
        </div>
      ))}
      <button onClick={addHeader}>Add Header</button>
    </div>
  )
}

function BodyEditor({ value, onChange }) {
  return (
    <div>
      <h3>Request Body</h3>
      <p>
        Insert <code>{"{{PROMPT}}"}</code> where the user's prompt should go.</p>
      <textarea
        style={{ width: "100%", height: 200, fontFamily: "monospace" }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}