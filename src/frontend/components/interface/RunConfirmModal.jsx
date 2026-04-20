import React from 'react';
import FloatingWindow from '#src/frontend/components/base/FloatingWindow';
import Button from '#src/frontend/components/base/Button';
import { useAppContext } from '#src/frontend/renderer/renderer';

const RunConfirmModal = ({ open, onConfirm, onCancel, fileName, lineCount }) => {
    const { mode, selectedAgent, setSkipConfirmModal } = useAppContext();

    const handleDontShowAgain = () => {
        setSkipConfirmModal(true);
        onConfirm();
    };

    const modeLabel = mode === "1stPass" ? "Detailed" : "Full Pass";

    return (
        <FloatingWindow
            open={open}
            title="Confirm Run"
            onClose={onCancel}
        >
            <FloatingWindow.Body>
                <p>Are you sure you want to run this file?</p>
                {fileName && (
                    <p>
                        <strong>File:</strong> {fileName}
                        {lineCount !== undefined && <> <span>({lineCount} lines)</span></>}
                    </p>
                )}
                <p><strong>Mode:</strong> {modeLabel}</p>
                <p><strong>Agent:</strong> {selectedAgent}</p>
            </FloatingWindow.Body>
            <FloatingWindow.Footer>
                <Button onClick={handleDontShowAgain}>Don't show me this again</Button>
                <Button variant="green" onClick={onConfirm}>Run</Button>
            </FloatingWindow.Footer>
        </FloatingWindow>
    );
};

export default RunConfirmModal;
