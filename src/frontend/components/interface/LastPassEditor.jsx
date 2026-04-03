import React from 'react';
import { Editor } from '@monaco-editor/react';

export const LastPassEditor = ({finalPassText, setFinalPassText}) => {
  const handleEditorChange = (value) => {
    setFinalPassText(value);
  };
  return (
    <div style={{width: "100%"}}>
        <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginBlock: "2px", height:"20px"}}>
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