import React from "react";
import AgentPicker from "../components/agent/AgentPicker";
import AgentAdd from "../components/agent/AgentAdd";
import { useAppContext } from "../renderer/renderer";
import ExportJavaButton from "../components/interface/ExportButton";
import CopyToClipboardButton from "../components/interface/CopyToClipboardButton";

export default function Footer() {
    const { output, setOutput } = useAppContext();
    const { processing } = useAppContext();
    
    return (
        <nav className="navbar">
            {processing === true ? (<>
                <ExportJavaButton content={output}/>
                <CopyToClipboardButton content={output}/>
            </>):(<></>)} 
        </nav>
    );
}