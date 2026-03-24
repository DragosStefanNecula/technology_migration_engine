// TODO: remember the text editor
import React from 'react';
import FirstPassEditor from './FirstPassEditor';

export const Pane = ({ code, context }) => {

  return (
    <>
      {/* <TextHelper/> */}
      {/* <ContextViewer/> */}
      {/* 1st Pass */}
      <FirstPassEditor buffer={code}/>
      {/* 2nd Pass */}
      {/* <SecondPassEditor/> */}
      {/* TODO: Change between them and have all the neat mode logic */}
    </>
  );
};

export default Pane; 