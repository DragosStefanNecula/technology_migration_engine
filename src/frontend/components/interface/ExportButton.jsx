import React from 'react';

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
        <button onClick={handleClick}>
            Export as .java
        </button>
    );
};

export default ExportJavaButton;