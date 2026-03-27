// TODO: remember the text editor
import React from 'react';
import FirstPassEditor from './FirstPassEditor';
import ContextViewer from './ContextViewer';

export const Pane = ({ currentCodeBuffer, sourceContext }) => {

  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        padding: "20px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px"
      }}
    >
      {/* <TextHelper/> */}
      <ContextViewer code={sourceContext}/>
      {/* 1st Pass */}

      <FirstPassEditor currentCodeBuffer={currentCodeBuffer} sourceContext={sourceContext}/>
      {/* TODO: interface with buttons */}
      {/* 2nd Pass */}
      {/* <SecondPassEditor/> */}
      {/* TODO: Change between them and have all the neat mode logic */}
    </div>
  );
};

export default Pane; 