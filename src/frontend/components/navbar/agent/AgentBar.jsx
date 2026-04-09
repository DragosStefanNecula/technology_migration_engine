import React from 'react';
import { useState, useEffect } from 'react';

import AgentPicker from "#src/frontend/components/navbar/agent/AgentPicker";
import AgentAdd from "#src/frontend/components/navbar/agent/AgentAdd";
import AgentEdit from "#src/frontend/components/navbar/agent/AgentEdit";

import { useAppContext } from '#src/frontend/renderer/renderer';
import { OutlinedGroup } from '#src/frontend/components/base/OutlinedGroup';

const AgentBar = () => {
    const { selectedAgent, setSelectedAgent } = useAppContext();

    useEffect(() => {
        localStorage.setItem("selectedAgent", selectedAgent);
    }, [selectedAgent]);

    const [options, setOptions] = useState([]);
    const [reloadAgentsFlag, setReloadAgentsFlag] = useState(false);

    const triggerReloadAgents = () => {
        setReloadAgentsFlag(prev => !prev);
    };

    useEffect(() => {
        const loadAgents = async () => {
            const names = await window.apiStore.getApiConfigNames();
            const opts = names.map((name) => ({ label: name, value: name }));
            setOptions(opts);

            if (opts.length > 0 && !selectedAgent) {
                setSelectedAgent(opts[0].value);
            }
        };

        loadAgents();
    }, [reloadAgentsFlag]);

    return (
        <OutlinedGroup label="Agent">
            <div><AgentPicker options={options} selectedAgent={selectedAgent} setSelectedAgent={setSelectedAgent}/></div>
            <div><AgentAdd options={options} triggerReloadAgents={triggerReloadAgents}/></div>
            <div><AgentEdit options={options} selectedAgent={selectedAgent} setSelectedAgent={setSelectedAgent} triggerReloadAgents={triggerReloadAgents}/></div>
        </OutlinedGroup>
    );
};

export default AgentBar; 