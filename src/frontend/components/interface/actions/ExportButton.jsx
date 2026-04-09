import React from 'react';
import Button from '#src/frontend/components/base/Button';

const ExportJavaButton = ({ content }) => {
    const handleClick = async () => {
        try {
            const path = await window.electronAPI.saveJavaFile(content);
            if (path) {
                console.log('File saved at:', path);
            }
        } catch (err) {
            console.error('Error saving file:', err);
        }
    };

    return (
        <Button onClick={handleClick} clickable={content!=null} reason={"First confirm between first pass and second pass in all panes."}>
            Export as .java
        </Button>
    );
};

export default ExportJavaButton;