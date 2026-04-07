import React, { useState, useEffect } from 'react';

import AgentConfiguration from './AgentConfiguration';
import {
    hasValidationErrors,
    validateAgentConfig
} from "./agentFormValidation";

import Button from '../../base/Button';
import FloatingWindow from '../../base/FloatingWindow';
import Select from '../../base/Select';
import DeleteModal from '../../base/DeleteModal';
import Divider from '../../base/Divider';

const AgentEdit = ({ options, selectedAgent, setSelectedAgent, triggerReloadAgents }) => {
    const [open, setOpen] = useState(false);
    const [getConfirmation, setGetConfirmation] = useState(false);
    const [config, setConfig] = useState(null);
    const [errors, setErrors] = useState({ name: "", requestBody: "", responsePath: "" });
    const [apiError, setApiError] = useState("");

    useEffect(() => {
        if (!selectedAgent || open === false) return;

        const loadConfig = async () => {
            setApiError("");
            try {
                const loaded = await window.apiStore.getApiConfig(selectedAgent);
                setConfig(loaded);
            } catch (err) {
                const message = err?.message || `Failed to load config for ${selectedAgent}.`;
                setApiError(message);
                console.error(`Failed to load config for ${selectedAgent}:`, err);
                setConfig(null);
            }
        };

        loadConfig();
    }, [open, selectedAgent]);

    useEffect(() => {
        if (!config) {
            setErrors({ name: "", requestBody: "", responsePath: "" });
            return;
        }

        setErrors(validateAgentConfig({ config, options, originalName: selectedAgent }));
    }, [config, options, selectedAgent]);

    const handleEdit = async () => {
        setApiError("");
        if (!selectedAgent) {
            const message = "No agent selected to edit.";
            setApiError(message);
            console.error(message);
            return;
        }

        const nextErrors = validateAgentConfig({ config, options, originalName: selectedAgent });
        setErrors(nextErrors);
        if (hasValidationErrors(nextErrors)) return;

        const apiConfigObject = {
            name: config.name,
            url: config.url,
            method: config.method,
            headers: config.headers,
            requestBody: config.requestBody,
            responsePath: config.responsePath
        };

        try {
            const response = await window.apiStore.editApiConfig(selectedAgent, apiConfigObject);
            console.log(`API config "${response.name}" edited successfully.`);
            setApiError("");

            triggerReloadAgents();
            if (selectedAgent !== apiConfigObject.name) {
                setSelectedAgent(apiConfigObject.name);
            }
        } catch (err) {
            const message = err?.message || "Failed to save agent changes. Please try again.";
            setApiError(message);
            console.error("Failed to edit config:", message);
        }
    };

    const handleDelete = async () => {
        setApiError("");
        if (!selectedAgent) {
            const message = "No agent selected to delete.";
            setApiError(message);
            console.error(message);
            return;
        }

        try {
            const response = await window.apiStore.deleteApiConfig(selectedAgent);
            console.log(`API config "${response.name}" deleted successfully.`);
            setApiError("");

            setGetConfirmation(false);
            setSelectedAgent("");
            triggerReloadAgents();
        } catch (err) {
            const message = err?.message || "Failed to delete agent. Please try again.";
            setApiError(message);
            console.error("Failed to delete config:", message);
        }
    };

    return (
        <>
            <Button onClick={() => setOpen(!open)} variant="white">Edit Agent</Button>

            <FloatingWindow
                open={open}
                title="Agent Picker"
                onClose={() => setOpen(false)}
            >
                <FloatingWindow.Body>
                    <Select
                        options={options}
                        value={selectedAgent}
                        placeholder="Templates"
                        onChange={(e) => setSelectedAgent(e.target.value)}
                        variant="yellow"
                        style={{ display: "inline-block", width: "auto", minWidth: "150px" }}
                    />

                    <Divider />

                    {config != null && (
                        <AgentConfiguration
                            config={config}
                            setConfig={setConfig}
                            validationErrors={errors}
                        />
                    )}
                </FloatingWindow.Body>

                <FloatingWindow.Footer
                    style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                    {hasValidationErrors(errors) && (
                        <span style={{ color: "red", fontSize: "0.9em", marginRight: "10px" }}>
                            Please fix the highlighted form errors.
                        </span>
                    )}
                    {apiError && (
                        <span style={{ color: "red", fontSize: "0.9em", marginRight: "10px" }}>
                            {apiError}
                        </span>
                    )}

                    <Button onClick={() => setGetConfirmation(true)}>Delete</Button>

                    {(config && !hasValidationErrors(errors)) ? (
                        <Button onClick={handleEdit}>Save</Button>
                    ) : (<></>)}
                </FloatingWindow.Footer>
            </FloatingWindow>

            <DeleteModal
                open={getConfirmation}
                setOpen={setGetConfirmation}
                line="Are you sure you want to delete this agent?"
                onClick={handleDelete}
            />
        </>
    );
};

export default AgentEdit;
