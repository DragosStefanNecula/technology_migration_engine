// TODO: remember the text editor
import React from 'react';
import FirstPassEditor from './FirstPassEditor';

export const Pane = ({ currentCodeBuffer, sourceContext }) => {

  return (
    <>
      {/* <TextHelper/> */}
      {/* <ContextViewer/> */}
      {/* 1st Pass */}
      <FirstPassEditor currentCodeBuffer={currentCodeBuffer} sourceContext={sourceContext}/>
      {/* 2nd Pass */}
      {/* <SecondPassEditor/> */}
      {/* TODO: Change between them and have all the neat mode logic */}
    </>
  );
};

export default Pane; 