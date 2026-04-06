import React from 'react';

const LockedSelections = ({ mode, agent }) => {
    return (
        <>
            <div className="info-table">
                <div className="label">Selected Mode</div>
                <div className="value">
                    {mode === "1stPass" ? "Detailed" : "Full Pass"}
                </div>

                <div className="label">Selected Agent</div>
                <div className="value">{agent}</div>
            </div>
        </>
    );
};

export default LockedSelections; 