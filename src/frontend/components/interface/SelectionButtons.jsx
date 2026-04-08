import React from 'react';
import Button from '../base/Button';
import "./SelectionButtons.css";

export const SelectionButtons = ({ setCurrentView, currentView, onConfirm, firstPass, secondPass }) => {
    return (
        <div className="selection-buttons">
            <div className="selection-buttons__inner">
                <Button
                    className="selection-buttons__btn"
                    selected={currentView === "1stPass"}
                    onClick={() => setCurrentView("1stPass")}
                >
                    1st Pass
                </Button>
                <Button
                    className="selection-buttons__btn"
                    clickable={firstPass}
                    reason="Please wait for the first pass to finish."
                    selected={currentView === "2ndPass"}
                    onClick={() => setCurrentView("2ndPass")}
                >
                    2nd Pass
                </Button>
                <Button
                    className="selection-buttons__btn"
                    variant="green"
                    clickable={secondPass}
                    reason="Please wait for the second pass to finish."
                    onClick={onConfirm}
                >
                    Confirm
                </Button>
            </div>
        </div>
    );
};

export default SelectionButtons;
