import React from 'react';
import Button from './Button';
import FloatingWindow from './FloatingWindow';

const DeleteModal = ({ onClick, line, open, setOpen }) => {
    return (
        <>
            <FloatingWindow
                open={open}
                title="Confirm Deletion"
                onClose={() => setOpen(false)}
            >
                <FloatingWindow.Body>
                    {line}
                </FloatingWindow.Body>
                <FloatingWindow.Footer>
                    <Button onClick={() => setOpen(!open)}>No</Button>
                    <Button onClick={onClick}>Yes</Button>
                </FloatingWindow.Footer>
            </FloatingWindow>
        </>
    );
};

export default DeleteModal; 