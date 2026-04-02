import React from 'react';
import Button from '../base/Button';

export const SelectionButtons = ({ setCurrentView, onConfirm, firstPass, secondPass }) => {
  return (
    <div style={{height: "auto", width: "10%" }}>
        <div style={{height: "100%", width: "auto", display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <Button onClick={() => setCurrentView("1stPass")}>1st Pass</Button>
            <Button clickable={firstPass} onClick={() => setCurrentView("2ndPass")}>2nd Pass</Button>
            <Button clickable={secondPass} onClick={onConfirm}>Confirm</Button>
        </div> 
    </div>
  );
};

export default SelectionButtons; 