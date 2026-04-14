import React from "react";
import "#src/frontend/components/interface/upload/NoAgentState.css";

export default function NoAgentState() {
    return (
        <div className="no-agent-wrapper">
            <div className="no-agent-content">
                <p className="no-agent-heading">No agent configured</p>
                <p className="no-agent-description">
                    An AI agent is required to process files. Add one using the{" "}
                    <strong>Add Agent</strong> button in the <strong>Agent</strong> section above.
                </p>
            </div>
        </div>
    );
}
