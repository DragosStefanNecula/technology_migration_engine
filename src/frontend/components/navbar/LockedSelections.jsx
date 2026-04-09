import React from 'react';
import "#src/frontend/components/navbar/LockedSelections.css";

const LockedSelections = ({ mode, agent }) => {
    return (
        <div className="info-table">
            <div className="info-table__label">Selected Mode</div>
            <div className="info-table__value">
                {mode === "1stPass" ? "Detailed" : "Full Pass"}
            </div>

            <div className="info-table__label">Selected Agent</div>
            <div className="info-table__value">{agent}</div>
        </div>
    );
};

export default LockedSelections;
