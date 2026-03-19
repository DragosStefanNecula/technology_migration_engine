import React from 'react';
import Button from '../base/Button';
import FloatingWindow from '../base/FloatingWindow';
import { useState } from 'react';
import AgentConfiguration from './AgentConfiguration';
import Select from '../base/Select';
import { useEffect } from 'react';
import DeleteModal from '../base/DeleteModal';

const AgentEdit = ({ options, selectedAgent, setSelectedAgent, triggerReloadAgents }) => {
    const [open, setOpen] = useState(false);
    const [getConfirmation, setGetConfirmation] = useState(false);

    useEffect(() => {
        if (!selectedAgent || open == false) return;

        const loadConfig = async () => {
            try {
                const config = await window.apiStore.getApiConfig(selectedAgent);
                setConfig(config)
            } catch (err) {
                console.error(`Failed to load config for ${selectedAgent}:`, err);
                setConfig(null);
            }
        };

        loadConfig();
    }, [open, selectedAgent]);

    const [config, setConfig] = useState(null);

    const handleEdit = async () => {
        if (!selectedAgent) {
            console.error("No agent selected to edit");
            return;
        }

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

            triggerReloadAgents();
            if (selectedAgent !== apiConfigObject.name) {
                setSelectedAgent(apiConfigObject.name);
            }
        } catch (err) {
            console.error("Failed to edit config:", err.message);
        }
    };

    const handleDelete = async () => {
        if (!selectedAgent) {
            console.error("No agent selected to delete");
            return;
        }

        try {
            const response = await window.apiStore.deleteApiConfig(selectedAgent);
            console.log(`API config "${response.name}" deleted successfully.`);

            setGetConfirmation(false);
            setSelectedAgent("");
            triggerReloadAgents();
        } catch (err) {
            console.error("Failed to delete config:", err.message);
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
                        onChange={(e) => {
                            setSelectedAgent(e.target.value);
                        }}
                        variant="yellow"
                        style={{ display: "inline-block", width: "auto", minWidth: "150px" }}
                    />
                    {config != null && (<>
                        <AgentConfiguration config={config} setConfig={setConfig} />
                    </>)}
                </FloatingWindow.Body>
                <FloatingWindow.Footer>
                    <Button onClick={() => setGetConfirmation(true)}>Delete</Button>
                    <Button onClick={handleEdit}>Save</Button>
                </FloatingWindow.Footer>
            </FloatingWindow>

            <DeleteModal open={getConfirmation} setOpen={setGetConfirmation} line="Are you sure you want to delete this agent?" onClick={handleDelete} />
        </>
    );
};

export default AgentEdit; 