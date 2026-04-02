// TODO: remember the text editor
import React from 'react';
import FirstPassEditor from './FirstPassEditor';
import ContextViewer from './ContextViewer';
import { useAppContext } from '../../renderer/renderer';
import SecondPassEditor from './SecondPassEditor';
import LastPassEditor from './LastPassEditor';
import SelectionButtons from './SelectionButtons';
import { useState } from 'react';
import { useEffect } from 'react';

export const Pane = ({ currentCodeBuffer, sourceContext, functionName }) => {

    const { mode, setMode } = useAppContext();

    const [firstPassText, setFirstPassText] = useState(null); 

    const [secondPassText, setSecondPassText] = useState(null); 

    const [finalPassText, setFinalPassText] = useState(null); 

    const [currentView, setCurrentView] = useState("1stPass"); 
    
    useEffect(() =>
    {
        if (!firstPassText) return;
        setCurrentView("2ndPass");
    }, [firstPassText]); 

    useEffect(() =>
    {
        if(!secondPassText) return;
        if(mode === "2ndPass")
        {
            setFinalPassText(secondPassText);
        }
    }, [secondPassText]); 

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
            {/* TODO: <TextHelper/> on top */}
            <div
                style={{
                    display: "flex",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px"
                }}
            >
                <ContextViewer code={sourceContext} />
                {finalPassText === null ?
                    <>
                        <FirstPassEditor
                        isVisible={currentView === "1stPass"}
                        currentCodeBuffer={currentCodeBuffer}
                        sourceContext={sourceContext}
                        setFirstPassText={setFirstPassText}
                        />
                        {firstPassText != null && 
                            <SecondPassEditor
                                isVisible={currentView === "2ndPass"}
                                currentIteration={firstPassText}
                                sourceContext={sourceContext}
                                setSecondPassText={setSecondPassText}
                            />
                        }
                        {mode === "1stPass" && 
                            <SelectionButtons setCurrentView={setCurrentView} onConfirm={handleConfirm} firstPass={firstPassText!==null} secondPass={secondPassText != null}/>
                        }
                    </> 
                    : 
                    <>
                        <LastPassEditor finalPassText={finalPassText}/>
                    </>
                }
            </div>
        </div>
    );
};

export default Pane; 