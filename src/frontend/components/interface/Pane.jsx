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
import TextHelper from './TextHelper';
import "./Pane.css";

export const Pane = ({ currentCodeBuffer, sourceContext, functionName, onFinalText }) => {

    const { mode, setMode } = useAppContext();

    const [firstPassText, setFirstPassText] = useState(null);

    const [secondPassText, setSecondPassText] = useState(null);

    const [finalPassText, setFinalPassText] = useState(null);

    const [currentView, setCurrentView] = useState("1stPass");

    useEffect(() => {
        if (!firstPassText) return;
        setCurrentView("2ndPass");
    }, [firstPassText]);

    useEffect(() => {
        if (!secondPassText) return;
        if (mode === "2ndPass") {
            setFinalPassText(secondPassText);
        }
    }, [secondPassText]);

    const handleConfirm = () => {
        if (currentView === "1stPass") {
            setFinalPassText(firstPassText);
        }
        if (currentView === "2ndPass") {
            setFinalPassText(secondPassText);
        }
    };

    useEffect(() => {
        if (finalPassText === null) return;
        onFinalText(functionName, finalPassText);
    }, [finalPassText]);

    return (
        <div className="pane-card">
            <div className="pane-card__header">
                function {functionName}
                {finalPassText !== null ? <TextHelper sourceContext={sourceContext} finalPassText={finalPassText} /> : <></>}
            </div>
            {/* TODO: <TextHelper/> on top */}
            <div className="pane-card__editors">
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
                            <SelectionButtons setCurrentView={setCurrentView} currentView={currentView}
                                onConfirm={handleConfirm} firstPass={firstPassText !== null} secondPass={secondPassText != null} />
                        }
                    </>
                    :
                    <>
                        <LastPassEditor finalPassText={finalPassText} setFinalPassText={setFinalPassText} />
                    </>
                }
            </div>
        </div>
    );
};

export default Pane;
