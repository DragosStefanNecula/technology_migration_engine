import Editor from "@monaco-editor/react";
import React from "react";
import { useState, useEffect } from "react";
import { useAppContext } from "#src/frontend/renderer/renderer";
import { secondPassGenAi } from "#src/frontend/components/interface/checker/genAi";
import Spinner from "#src/frontend/components/base/Spinner";
import "#src/frontend/components/interface/checker/editors/PassEditor.css";

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
        <div className={`pass-editor${isVisible ? "" : " pass-editor--hidden"}`}>
            <div className="pass-editor__label">
                Second Pass
                {loading && (
                    <div className="pass-editor__spinner">
                        <Spinner size={10} />
                    </div>
                )}
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
