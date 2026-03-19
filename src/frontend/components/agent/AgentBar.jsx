import React from 'react';
import AgentPicker from "./AgentPicker";
import AgentAdd from "./AgentAdd";
import AgentEdit from "./AgentEdit";
import { useState, useEffect } from 'react';

const AgentBar = () => {
    const [selectedAgent, setSelectedAgent] = useState("");
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
        <>
            <li><AgentPicker options={options} selectedAgent={selectedAgent} setSelectedAgent={setSelectedAgent}/></li>
            <li><AgentAdd options={options} triggerReloadAgents={triggerReloadAgents}/></li>
            <li><AgentEdit options={options} selectedAgent={selectedAgent} setSelectedAgent={setSelectedAgent} triggerReloadAgents={triggerReloadAgents}/></li>
        </>
    );
};

export default AgentBar; 