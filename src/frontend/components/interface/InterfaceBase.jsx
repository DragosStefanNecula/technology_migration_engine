import React from 'react';
import FileUpload from "./FileUpload";
import Checker from './Checker';
import { useState } from 'react';
import MyEditor from './FirstPassEditor';

const InterfaceBase = () => {
    const [code, setCode] = useState(null);
    return (code == null ? <FileUpload setCode={setCode} /> : <Checker code={code}/>);
    // return <MyEditor/>
};

export default InterfaceBase; 