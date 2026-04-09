import React from "react";
import "#src/frontend/layout/Navbar.css";
import AgentBar from "#src/frontend/components/navbar/agent/AgentBar";
import { ModeSelect } from "#src/frontend/components/navbar/ModeSelect";
import { useAppContext } from "#src/frontend/renderer/renderer";
import LockedSelections from "#src/frontend/components/navbar/LockedSelections";
import Button from "#src/frontend/components/base/Button";

export default function Navbar() {
    const { processing, setProcessing, mode, selectedAgent, setOutput } = useAppContext();
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <h2>Technology Migration Engine</h2>
            </div>
            <div className="navbar-right">
                {!processing ? (<>
                    <ModeSelect />
                    <AgentBar />
                </>):(<>
                    <LockedSelections mode={mode} agent={selectedAgent}/>
                    <Button onClick={() => {setProcessing(false); setOutput(null);}}>Reset</Button>
                </>)} 
            </div>
        </nav>
    );
}