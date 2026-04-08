import React from 'react';
import { Editor } from '@monaco-editor/react';
import "./PassEditor.css";

export const LastPassEditor = ({ finalPassText, setFinalPassText }) => {
    const handleEditorChange = (value) => {
        setFinalPassText(value);
    };

    return (
        <div className="pass-editor">
            <div className="pass-editor__label">
                Final Pass
            </div>
            <Editor
                height="400px"
                defaultLanguage="java"
                value={finalPassText}
                onChange={handleEditorChange}
                options={{
                    lineNumbers: "off",
                    minimap: { enabled: false },
                }}
            />
        </div>
    );
};

export default LastPassEditor;
