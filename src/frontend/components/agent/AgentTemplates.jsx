export const agentTemplates = [
    {
        name: "ChatGPT",
        url: "",
        method: "POST",
        headers: [],
        requestBody: `{
        "model": "gpt-4",
        "messages": [
            {
            "role": "user",
            "content": "{{PROMPT}}"
            }
        ]
        }`,
        responsePath: ""
    },
    {
        name: "Claude",
        url: "",
        method: "POST",
        headers: [{ key: "...", value: "..." }],
        requestBody: `{
        "model": "gpt-4",
        "messages": [
            {
            "role": "user",
            "content": "{{PROMPT}}"
            }
        ]
        }`,
        responsePath: ""
    },
]