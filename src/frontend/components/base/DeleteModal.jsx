import React from 'react';
import Button from '#src/frontend/components/base/Button';
import FloatingWindow from '#src/frontend/components/base/FloatingWindow';

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