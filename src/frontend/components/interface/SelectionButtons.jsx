import React from 'react';
import Button from '../base/Button';

export const SelectionButtons = ({ setCurrentView, currentView, onConfirm, firstPass, secondPass }) => {
    return (
        <div style={{ height: "auto", width: "15%" }}>
            <div style={{
                height: "100%", width: "auto", display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <Button style={{ marginBlock: "2px" }}
                    selected={currentView === "1stPass"}
                    onClick={() => setCurrentView("1stPass")}>1st Pass</Button>
                <Button style={{ marginBlock: "2px" }}
                    clickable={firstPass} reason="Please wait for the first pass to finish."
                    selected={currentView === "2ndPass"}
                    onClick={() => setCurrentView("2ndPass")}>2nd Pass</Button>
                <Button style={{ marginBlock: "2px" }} variant={"green"}
                    clickable={secondPass} reason="Please wait for the second pass to finish."
                    onClick={onConfirm}>Confirm</Button>
            </div>
        </div>
    );
};

export default SelectionButtons; 