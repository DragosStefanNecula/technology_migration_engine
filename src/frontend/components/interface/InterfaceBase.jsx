import React from 'react';
import FileUpload from "./FileUpload";
import Checker from './Checker';
import { useState } from 'react';

const InterfaceBase = () => {
    const [code, setCode] = useState(null);
    return (code == null ? <FileUpload setCode={setCode} /> : <Checker code={code}></Checker>);
};

export default InterfaceBase; 