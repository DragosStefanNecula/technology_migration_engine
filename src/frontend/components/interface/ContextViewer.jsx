import React from 'react';
import { Editor } from '@monaco-editor/react';

export const ContextViewer = ({ code }) => {
    return (
        <div style={{width: "100%"}}>
            <div style={{width: "100%", display: "flex", justifyContent: "center", marginBlock: "2px", height:"20px"}}>
                Source Code
            </div> 
            <Editor //TODO: add support for perl
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