import React from "react";
import AgentPicker from "../components/agent/AgentPicker";
import AgentAdd from "../components/agent/AgentAdd";
import { useAppContext } from "../renderer/renderer";
import ExportJavaButton from "../components/interface/ExportButton";

export default function Footer() {
    const { output, setOutput } = useAppContext();
    
    return (
        <nav className="navbar">
            <ExportJavaButton content={output}/>
        </nav>
    );
}