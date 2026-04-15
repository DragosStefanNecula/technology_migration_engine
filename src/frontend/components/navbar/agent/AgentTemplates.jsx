//[[req8impl| ]] Adheres to [[#req8spec|Requirement 8]]
export const agentTemplates = [
  {
    name: "OpenAI Chat Completions",
    url: "https://api.openai.com/v1/chat/completions",
    method: "POST",
    headers: [
      { key: "Authorization", value: "Bearer YOUR_OPENAI_API_KEY" },
      { key: "Content-Type", value: "application/json" }
    ],
    requestBody: `{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "user",
      "content": "{{PROMPT}}"
    }
  ]
}`,
    responsePath: "choices[0].message.content"
  },
  {
    name: "Anthropic Claude",
    url: "https://api.anthropic.com/v1/messages",
    method: "POST",
    headers: [
      { key: "x-api-key", value: "YOUR_ANTHROPIC_API_KEY" },
      { key: "anthropic-version", value: "2023-06-01" },
      { key: "Content-Type", value: "application/json" }
    ],
    requestBody: `{
  "model": "claude-sonnet-4-6",
  "max_tokens": 1024,
  "messages": [
    {
      "role": "user",
      "content": "{{PROMPT}}"
    }
  ]
}`,
    responsePath: "content[0].text"
  },
  {
    name: "Google Gemini",
    url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    method: "POST",
    headers: [
      { key: "x-goog-api-key", value: "YOUR_GEMINI_API_KEY" },
      { key: "Content-Type", value: "application/json" }
    ],
    requestBody: `{
  "contents": [
    {
      "parts": [
        {
          "text": "{{PROMPT}}"
        }
      ]
    }
  ]
}`,
    responsePath: "candidates[0].content.parts[0].text"
  },
  {
    name: "Ollama Local",
    url: "http://localhost:11434/api/chat",
    method: "POST",
    headers: [
      { key: "Content-Type", value: "application/json" }
    ],
    requestBody: `{
  "model": "llama3.2",
  "messages": [
    {
      "role": "user",
      "content": "{{PROMPT}}"
    }
  ],
  "stream": false
}`,
    responsePath: "message.content"
  },
  {
    name: "Groq",
    url: "https://api.groq.com/openai/v1/chat/completions",
    method: "POST",
    headers: [
      { key: "Authorization", value: "Bearer YOUR_GROQ_API_KEY" },
      { key: "Content-Type", value: "application/json" }
    ],
    requestBody: `{
  "model": "llama-3.3-70b-versatile",
  "messages": [
    {
      "role": "user",
      "content": "{{PROMPT}}"
    }
  ]
}`,
    responsePath: "choices[0].message.content"
  }
];
