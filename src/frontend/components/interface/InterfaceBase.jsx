import React from 'react';
import FileUpload from "./FileUpload";
import Checker from './Checker';
import { useState } from 'react';
import MyEditor from './FirstPassEditor';
import { useAppContext } from '../../renderer/renderer';

const InterfaceBase = () => {
    const { processing } = useAppContext();
    const [code, setCode] = useState(null);
    return (processing === false ? <FileUpload setCode={setCode} /> : <Checker code={code}/>);
};

export default InterfaceBase; 