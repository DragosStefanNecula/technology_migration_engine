import React from "react";
import "#src/frontend/layout/Navbar.css";
import { useAppContext } from "#src/frontend/renderer/renderer";
import ExportJavaButton from "#src/frontend/components/interface/actions/ExportButton";
import CopyToClipboardButton from "#src/frontend/components/interface/actions/CopyToClipboardButton";

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