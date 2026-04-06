import React from "react";
import AgentBar from "../components/navbar/agent/AgentBar";
import { ModeSelect } from "../components/navbar/ModeSelect";
import { useAppContext } from "../renderer/renderer";
import LockedSelections from "../components/navbar/LockedSelections";
import Button from "../components/base/Button";

export default function Navbar() {
    const { processing, setProcessing, mode, selectedAgent, setOutput } = useAppContext();
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <h2>Technology Migration Engine</h2>
            </div>
            <ul className="navbar-right">
                {!processing ? (<>
                    <ModeSelect />
                    <AgentBar />
                </>):(<>
                    <LockedSelections mode={mode} agent={selectedAgent}/>
                    <Button onClick={() => {setProcessing(false); setOutput(null);}}>Reset</Button>
                </>)} 
            </ul>
        </nav>
    );
}