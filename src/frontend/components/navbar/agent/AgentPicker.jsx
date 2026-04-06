import React from 'react';
import Select from '../../base/Select';

const AgentPicker = ({ options, selectedAgent, setSelectedAgent }) => {

    return (
        <>
            Choose Agent:
            <Select
                options={options}
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                style={{ display: "inline-block", width: "auto", minWidth: "150px" }}
            />
        </>
    );
};

export default AgentPicker;