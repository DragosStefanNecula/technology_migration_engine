// TODO: remember the text editor
import React from 'react';
import FirstPassEditor from './FirstPassEditor';
import ContextViewer from './ContextViewer';
import { useAppContext } from '../../renderer/renderer';

export const Pane = ({ currentCodeBuffer, sourceContext, functionName }) => {

    const { mode, setMode } = useAppContext();

    return (
        <div style={{
            marginBlock: "5px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px"
        }}>
            <div style={{ padding: "20px", width: "100%", display: "flex", justifyContent: "center" }}>
                function {functionName}
            </div>
            <div
                style={{
                    display: "flex",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px"
                }}
            >
                {/* <TextHelper/> on top */}
                <ContextViewer code={sourceContext} />

                {/* show firstpasseditor process, 
        then secondpasseditor process 
        then choose */}
                {/* if mode = 1st have two buttons to see the two and click submit */}
                {/* if mode = 2nd, it's almost as if the second button was pressed */}

                <FirstPassEditor currentCodeBuffer={currentCodeBuffer} sourceContext={sourceContext} />

                {/* TODO: interface with buttons */}
                {/* 2nd Pass */}
                {/* <SecondPassEditor/> */}
                {/* TODO: Change between them and have all the neat mode logic */}
            </div>
        </div>
    );
};

export default Pane; 