// TODO: remember the text editor
import React from 'react';
import FirstPassEditor from './FirstPassEditor';
import ContextViewer from './ContextViewer';
import { useAppContext } from '../../renderer/renderer';
import SecondPassEditor from './SecondPassEditor';
import LastPassEditor from './LastPassEditor';
import { useState } from 'react';
import SelectionButtons from './SelectionButtons';

export const Pane = ({ currentCodeBuffer, sourceContext, functionName }) => {

    const { mode, setMode } = useAppContext();

    const [firstPassText, setFirstPassText] = useState(null); 

    const [secondPassText, setSecondPassText] = useState(null); 

    const [finalPassText, setFinalPassText] = useState(null); 

    const [currentView, setCurrentView] = useState("1stPass"); 

    const isSecondPassVisible = mode === "2ndPass" || (mode === "1stPass" && currentView === "2ndPass");

    const handleConfirm = () => {
        if(currentView === "1stPass") {
            setFinalPassText(firstPassText);
        }
        if(currentView === "2ndPass")
        {
            setFinalPassText(secondPassText);
        }
        console.log(finalPassText)
    }

    return (
        <div style={{
            marginBlock: "5px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
        }}>
            <div style={{ paddingBlock: "20px", width: "100%", display: "flex", justifyContent: "center" }}>
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
                {finalPassText === null ?
                    <>
                        <FirstPassEditor
                        isVisible={!isSecondPassVisible}
                        currentCodeBuffer={currentCodeBuffer}
                        sourceContext={sourceContext}
                        setFirstPassText={setFirstPassText}
                        />
                        {firstPassText != null && 
                            <SecondPassEditor
                                isVisible={isSecondPassVisible}
                                currentIteration={firstPassText}
                                sourceContext={sourceContext}
                                setSecondPassText={setSecondPassText}
                            />
                        }
                        <SelectionButtons setCurrentView={setCurrentView} onConfirm={handleConfirm} firstPass={firstPassText!==null} secondPass={secondPassText != null}/>
                    </> 
                    : 
                    <>
                        <LastPassEditor finalPassText={finalPassText}/>
                    </>
                }



                {/* TODO: interface with buttons */}
                {/* 2nd Pass */}
                {/* <SecondPassEditor/> */}
                {/* TODO: Change between them and have all the neat mode logic */}
            </div>
        </div>
    );
};

export default Pane; 