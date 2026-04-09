import React, { useState, useEffect } from 'react';

import { agentTemplates } from "#src/frontend/components/navbar/agent/AgentTemplates";
import AgentConfiguration from '#src/frontend/components/navbar/agent/AgentConfiguration';
import {
    hasValidationErrors,
    validateAgentConfig
} from "#src/frontend/components/navbar/agent/agentFormValidation";

import Button from '#src/frontend/components/base/Button';
import Select from '#src/frontend/components/base/Select';
import Divider from '#src/frontend/components/base/Divider';
import FloatingWindow from '#src/frontend/components/base/FloatingWindow';
import "#src/frontend/components/navbar/agent/AgentAdd.css";

const AgentAdd = ({ options, triggerReloadAgents }) => {
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({ name: "", requestBody: "", responsePath: "" });
    const [apiError, setApiError] = useState("");

    function cloneAgentConfig(config) {
        return {
            ...config,
            headers: (config?.headers || []).map((header) => ({ ...header }))
        };
    }
    const [config, setConfig] = useState(() => {
        const initial = agentTemplates[0];
        return cloneAgentConfig(initial);
    });

    useEffect(() => {
        setErrors(validateAgentConfig({ config, options }));
    }, [config, options]);

    const handleSubmit = async () => {
        setApiError("");
        const nextErrors = validateAgentConfig({ config, options });
        setErrors(nextErrors);
        if (hasValidationErrors(nextErrors)) {
            return;
        }

        const apiConfigObject = {
            name: config?.name || "",
            url: config?.url || "",
            method: config?.method || "GET",
            headers: config?.headers || [],
            requestBody: config?.requestBody || "",
            responsePath: config?.responsePath || ""
        };

        try {
            const response = await window.apiStore.saveApiConfig(apiConfigObject);
            triggerReloadAgents();
            setConfig(cloneAgentConfig(agentTemplates[0]));
            setOpen(false);
            setApiError("");
            console.log(`API config "${response.name}" saved successfully.`);
        } catch (err) {
            const message = err?.message || "Failed to save agent. Please try again.";
            setApiError(message);
            console.error(message);
        }
    };

    return (
        <>
            <Button onClick={() => setOpen(!open)} variant="white">
                Add Agent
            </Button>

            <FloatingWindow
                open={open}
                title="Agent Picker"
                onClose={() => setOpen(false)}
            >
                <FloatingWindow.Body>
                    <Select
                        options={agentTemplates.map(agent => ({
                            label: agent.name,
                            value: agent.name
                        }))}
                        value=""
                        placeholder="Templates"
                        onChange={(e) => {
                            const agent = agentTemplates.find(a => a.name === e.target.value);
                            if (!agent) return;

                            setConfig(cloneAgentConfig(agent));
                            e.target.value = "";
                        }}
                        variant="yellow"
                        className="agent-form-select"
                    />

                    <Divider />

                    <AgentConfiguration
                        config={config}
                        setConfig={setConfig}
                        validationErrors={errors}
                        templateHintsEnabled={true}
                    />
                </FloatingWindow.Body>

                <FloatingWindow.Footer>
                    {hasValidationErrors(errors) && (
                        <span className="agent-form-error">
                            Please fix the highlighted form errors.
                        </span>
                    )}
                    {apiError && (
                        <span className="agent-form-error">
                            {apiError}
                        </span>
                    )}

                    <Button onClick={handleSubmit} clickable={!hasValidationErrors(errors)} reason="Please fix the highlighted form errors.">Save</Button>
                </FloatingWindow.Footer>
            </FloatingWindow>
        </>
    );
};

export default AgentAdd;
