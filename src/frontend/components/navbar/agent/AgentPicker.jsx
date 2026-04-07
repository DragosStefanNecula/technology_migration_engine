import React from 'react';
import Select from '../../base/Select';

const AgentPicker = ({ options, selectedAgent, setSelectedAgent }) => {

    return (
        <>
            <Select
                options={options}
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                style={{ display: "inline-block", width: "150px" }}
            />
        </>
    );
};

export default AgentPicker;