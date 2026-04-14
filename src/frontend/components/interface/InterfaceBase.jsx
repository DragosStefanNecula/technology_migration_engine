import React from 'react';
import FileUpload from "#src/frontend/components/interface/upload/FileUpload";
import NoAgentState from "#src/frontend/components/interface/upload/NoAgentState";
import Checker from '#src/frontend/components/interface/checker/Checker';
import { useState } from 'react';
import { useAppContext } from '#src/frontend/renderer/renderer';

const InterfaceBase = () => {
    const { processing, selectedAgent } = useAppContext();
    const [code, setCode] = useState(null);

    if (!processing) {
        return !selectedAgent ? <NoAgentState /> : <FileUpload setCode={setCode} />;
    }
    return <Checker code={code} />;
};

export default InterfaceBase; 