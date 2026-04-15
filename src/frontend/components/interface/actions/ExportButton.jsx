import React from 'react';
import Button from '#src/frontend/components/base/Button';
import { useToast } from '#src/frontend/components/base/Toast';

const ExportJavaButton = ({ content }) => {
    const showToast = useToast();

    const handleClick = async () => {
        try {
            const result = await window.electronAPI.saveJavaFile(content);
            if (result?.success) {
                showToast(`File saved to: ${result.filePath}`);
            } else if (result?.error) {
                showToast(`Failed to save file: ${result.error}`);
            }
        } catch (err) {
            showToast('An unexpected error occurred while saving.');
        }
    };

    return (
        <Button onClick={handleClick} clickable={content != null && content.length > 0} reason={"First confirm between first pass and second pass in all panes."}>
            Export as .java
        </Button>
    );
};

export default ExportJavaButton;