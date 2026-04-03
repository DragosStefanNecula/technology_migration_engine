import React from "react";
import AgentPicker from "../components/agent/AgentPicker";
import AgentAdd from "../components/agent/AgentAdd";
import { useAppContext } from "../renderer/renderer";

export default function Footer() {
    const { output, setOutput } = useAppContext();
    
    return (
        <nav className="navbar">
            <div className="navbar-left">
                {/* {output} */}
            </div>
            <ul className="navbar-right">
            </ul>
        </nav>
    );
}