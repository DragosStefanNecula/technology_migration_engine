import React from 'react';
import { Editor } from '@monaco-editor/react';

export const ContextViewer = ({ code }) => {
    return (
        <Editor
            height="400px"
            defaultValue={code}
            options={{
                lineNumbers: "off", // TODO: disables all line numbers
                minimap: { enabled: false },
            }}
        />
    );
};

export default ContextViewer; 