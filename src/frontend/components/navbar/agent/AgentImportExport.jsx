import React, { useState, useEffect, useRef } from 'react';

import Button from '#src/frontend/components/base/Button';
import FloatingWindow from '#src/frontend/components/base/FloatingWindow';
import { useToast } from '#src/frontend/components/base/Toast';
import '#src/frontend/components/navbar/agent/AgentImportExport.css';

const AgentImportExport = ({ triggerReloadAgents }) => {
    const showToast = useToast();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [importOpen, setImportOpen] = useState(false);
    const [mergeMode, setMergeMode] = useState(true);
    const [busy, setBusy] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!dropdownOpen) return;
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownOpen]);

    const handleExport = async () => {
        setDropdownOpen(false);
        const result = await window.apiStore.exportApiConfigs();
        if (result?.success) {
            showToast(`Agents exported to: ${result.filePath}`);
        } else if (!result?.cancelled) {
            showToast('Export failed. Please try again.');
        }
    };

    const openImport = () => {
        setDropdownOpen(false);
        setImportOpen(true);
    };

    const handleImport = async () => {
        setBusy(true);
        try {
            const result = await window.apiStore.importApiConfigs(mergeMode);
            if (result?.success) {
                triggerReloadAgents();
                setImportOpen(false);
                showToast(`${result.count} agent(s) imported successfully.`);
            } else if (!result?.cancelled) {
                showToast(result?.error || 'Import failed. Please try again.');
            }
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <div className="agent-overflow-container" ref={containerRef}>
                <Button
                    variant="white"
                    onClick={() => setDropdownOpen(prev => !prev)}
                    selected={dropdownOpen}
                >
                    ⋯
                </Button>

                {dropdownOpen && (
                    <div className="agent-overflow-menu">
                        <button className="agent-overflow-item" onClick={handleExport}>
                            Export all agents
                        </button>
                        <button className="agent-overflow-item" onClick={openImport}>
                            Import agents
                        </button>
                    </div>
                )}
            </div>

            <FloatingWindow
                open={importOpen}
                title="Import Agents"
                onClose={() => setImportOpen(false)}
            >
                <FloatingWindow.Body>
                    <p style={{ margin: '0 0 12px', fontSize: '0.875rem' }}>
                        Choose how to handle existing agents when importing:
                    </p>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                        <input
                            type="radio"
                            name="importMode"
                            checked={mergeMode}
                            onChange={() => setMergeMode(true)}
                        />
                        Merge — keep existing agents, add or overwrite by name
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', marginTop: '8px' }}>
                        <input
                            type="radio"
                            name="importMode"
                            checked={!mergeMode}
                            onChange={() => setMergeMode(false)}
                        />
                        Replace — remove all existing agents and load from file
                    </label>
                </FloatingWindow.Body>

                <FloatingWindow.Footer>
                    <Button onClick={handleImport} clickable={!busy}>
                        Choose File & Import
                    </Button>
                </FloatingWindow.Footer>
            </FloatingWindow>
        </>
    );
};

export default AgentImportExport;
