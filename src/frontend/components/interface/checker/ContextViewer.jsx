import React from 'react';
import { Editor } from '@monaco-editor/react';
import "#src/frontend/components/interface/checker/ContextViewer.css";

export const ContextViewer = ({ code }) => {
    return (
        <div className="context-viewer">
            <div className="context-viewer__label">
                Source Code
            </div>
            <Editor
                height="400px"
                defaultValue={code}
                options={{
                    lineNumbers: "off",
                    minimap: { enabled: false },
                    readOnly: true
                }}
            />
        </div>
    );
};

export default ContextViewer;
