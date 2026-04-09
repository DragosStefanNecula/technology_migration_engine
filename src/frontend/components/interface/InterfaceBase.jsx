import React from 'react';
import FileUpload from "#src/frontend/components/interface/upload/FileUpload";
import Checker from '#src/frontend/components/interface/checker/Checker';
import { useState } from 'react';
import { useAppContext } from '#src/frontend/renderer/renderer';

const InterfaceBase = () => {
    const { processing } = useAppContext();
    const [code, setCode] = useState(null);
    return (processing === false ? <FileUpload setCode={setCode} /> : <Checker code={code}/>);
};

export default InterfaceBase; 