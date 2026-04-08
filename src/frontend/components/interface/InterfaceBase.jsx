import React from 'react';
import FileUpload from "./upload/FileUpload";
import Checker from './checker/Checker';
import { useState } from 'react';
import { useAppContext } from '../../renderer/renderer';

const InterfaceBase = () => {
    const { processing } = useAppContext();
    const [code, setCode] = useState(null);
    return (processing === false ? <FileUpload setCode={setCode} /> : <Checker code={code}/>);
};

export default InterfaceBase; 