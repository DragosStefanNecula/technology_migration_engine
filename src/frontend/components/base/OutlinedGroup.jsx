import React from "react";
import "#src/frontend/components/base/OutlinedGroup.css";

export const OutlinedGroup = ({ label, children}) => {
    return (
        <div className={`outlined-group`}>
            <span className="outlined-group__label">{label}</span>
            <div className="outlined-group__content">{children}</div>
        </div>
    );
};