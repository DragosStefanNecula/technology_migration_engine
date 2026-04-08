import React from 'react';
import Select from '../../base/Select';
import "./AgentPicker.css";

const AgentPicker = ({ options, selectedAgent, setSelectedAgent }) => {
    return (
        <Select
            options={options}
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="agent-picker-select"
        />
    );
};

export default AgentPicker;
