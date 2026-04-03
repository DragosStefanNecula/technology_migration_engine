import Editor from "@monaco-editor/react";
import React from "react";
import { useState, useEffect } from "react";
import { useAppContext } from "../../renderer/renderer";
import { secondPassGenAi } from "./genAi";
import Spinner from "../base/Spinner";

export default function SecondPassEditor({ currentIteration, sourceContext, setSecondPassText, isVisible }) {

    const { selectedAgent, setSelectedAgent } = useAppContext();

    const [showText, setShowText] = useState(currentIteration);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const run = async () => {
            setLoading(true);
            try {
                const result = await secondPassGenAi(sourceContext, currentIteration, selectedAgent);
                setSecondPassText(result);
                setShowText(result);
            } finally {
                setLoading(false);
            }
        };
        run();
    }, []);

    return (
        <div style={{ width: "100%", display: isVisible ? "block" : "none" }}>
            <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginBlock: "2px", height: "20px" }}>
                Second Pass
                {loading && <div style={{ marginInlineStart: "5px" }}>
                    <Spinner size={10} />
                </div>}
            </div>
            <Editor
                height="400px"
                defaultLanguage="java"
                value={showText}
                options={{
                    lineNumbers: "off",
                    minimap: { enabled: false },
                    readOnly: true
                }}
            />
        </div>
    );
}
