import React, { useState, useRef } from 'react';
import FileUpload from "#src/frontend/components/interface/upload/FileUpload";
import NoAgentState from "#src/frontend/components/interface/upload/NoAgentState";
import Checker from '#src/frontend/components/interface/checker/Checker';
import RunConfirmModal from '#src/frontend/components/interface/RunConfirmModal';
import { useAppContext } from '#src/frontend/renderer/renderer';

const InterfaceBase = () => {
    const { processing, setProcessing, selectedAgent, skipConfirmModal, error } = useAppContext();
    const [code, setCode] = useState(null);
    const [pendingCode, setPendingCode] = useState(null);

    // Always up-to-date ref so the Electron IPC listener (registered once on mount)
    // always calls the latest handler even after InterfaceBase re-renders.
    const onReadyRef = useRef(null);
    onReadyRef.current = (value) => {
        if (processing) return; // guard against stale Electron events firing during processing
        if (skipConfirmModal) {
            setCode(value);
            setProcessing(true);
        } else {
            setPendingCode(value);
        }
    };

    const handleConfirm = () => {
        setCode(pendingCode);
        setProcessing(true);
        setPendingCode(null);
    };

    const handleCancel = () => {
        setPendingCode(null);
    };

    if (error) {
        return (
            <div className="interface-error">
                <strong>Error</strong>
                <p>{error}</p>
            </div>
        );
    }

    if (!processing) {
        return (
            <>
                {!selectedAgent ? <NoAgentState /> : <FileUpload onReadyRef={onReadyRef} />}
                {pendingCode !== null && (
                    <RunConfirmModal
                        open={true}
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                    />
                )}
            </>
        );
    }
    return <Checker code={code} />;
};

export default InterfaceBase; 