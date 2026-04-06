
import React from 'react';
import { useState } from 'react';

import { agentTemplates } from "./AgentTemplates";
import AgentConfiguration from './AgentConfiguration';

import Button from '../../base/Button';
import Select from '../../base/Select';
import Divider from '../../base/Divider';
import FloatingWindow from '../../base/FloatingWindow';

const AgentAdd = ({ triggerReloadAgents }) => {
    const [open, setOpen] = useState(false);

    function cloneConfig(object) {
        return { ...object, headers: object.headers.map(h => ({ ...h })) };
    }

    const [config, setConfig] = useState(() => {
        const initial = agentTemplates[0];
        return cloneConfig(initial);
    });


    const handleSubmit = async () => {
        const apiConfigObject = {
            name: config.name,
            url: config.url,
            method: config.method,
            headers: config.headers,
            requestBody: config.requestBody,
            responsePath: config.responsePath
        };

        try {
            const response = await window.apiStore.saveApiConfig(apiConfigObject);
            triggerReloadAgents();
            setConfig(cloneConfig(agentTemplates[0]));
            setOpen(false);
            console.log(`API config "${response.name}" saved successfully.`);
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <>
            <Button onClick={() => setOpen(!open)} variant="white">Add Agent</Button>
            <FloatingWindow
                open={open}
                title="Agent Picker"
                onClose={() => setOpen(false)}
            >
                <FloatingWindow.Body>
                    <Select
                        options={agentTemplates.map(agent => ({ label: agent.name, value: agent.name }))}
                        value=""
                        placeholder="Templates"
                        onChange={(e) => {
                            const agent = agentTemplates.find(a => a.name === e.target.value);
                            if (!agent) return;

                            const copy = cloneConfig(agent);
                            setConfig(copy);

                            e.target.value = "";
                        }}
                        variant="yellow"
                        style={{ display: "inline-block", width: "auto", minWidth: "150px" }}
                    />
                    <Divider/>
                    <AgentConfiguration config={config} setConfig={setConfig} />
                </FloatingWindow.Body>
                <FloatingWindow.Footer>
                    <Button onClick={handleSubmit}>Save</Button>
                </FloatingWindow.Footer>
            </FloatingWindow>
        </>
    );
};

export default AgentAdd; 