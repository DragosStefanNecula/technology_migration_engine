import Editor from "@monaco-editor/react";
import React from "react";
import { useRef, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { genAi } from "./genAi";
import { useAppContext } from "../../renderer/renderer";
import Spinner from "../base/Spinner";

export default function SecondPassEditor({ currentIteration, sourceContext, setSecondPassText, isVisible }) {

    const { selectedAgent, setSelectedAgent } = useAppContext();

    const [loading, setLoading] = useState(false); 

    useEffect(() =>
    {
        setLoading(true);
        // TODO: MAKE REQUEST
        setSecondPassText(currentIteration);
        setLoading(false);
    }, []); 

    return (
        <div style={{width: "100%", display: isVisible ? "block" : "none"}}>
            <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginBlock: "2px", height:"20px"}}>
                Second Pass
                {loading && <div style={{marginInlineStart: "5px"}}>
                    <Spinner size={10} />
                </div>}
            </div> 
            <Editor
                height="400px"
                defaultLanguage="java" 
                defaultValue={currentIteration}
                options={{
                    lineNumbers: "off", 
                    minimap: { enabled: false },
                    readOnly: true
                }}
            />
        </div>
    );
}
