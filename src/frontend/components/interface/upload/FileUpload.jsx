import React, { useRef, useEffect, useState } from "react";
import "#src/frontend/components/interface/upload/FileUpload.css";

export default function FileUpload({ onReadyRef }) {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadError, setUploadError] = useState("");

    useEffect(() => {
        globalThis.electronAPI.sendReady();
    }, []);

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files[0]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        // prevents flicker when dragging over children
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsDragging(false);
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    useEffect(() => {
        if (globalThis.electronAPI) {
            globalThis.electronAPI.onSetValue((_, value) => {
                setUploadError("");
                onReadyRef.current(value);
            });
            globalThis.electronAPI.onFileUploadError(() => {
                setUploadError("Couldn't process the file. Can you try another?");
            });
        }
        return () => {
            globalThis.electronAPI?.removeUploadListeners();
        };
    }, []);

    const handleFileChange = async (file) => {
        if (!file) return;
        setUploadError("");
        const content = await file.text();
        globalThis.electronAPI.uploadFile({ name: file.name, content });
    };

    const handleChange = async (e) => {
        await handleFileChange(e.target.files[0]);
        e.target.value = "";
    };

    return (
        <div
            className={`upload-wrapper ${isDragging ? "dragging" : ""}`}
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                hidden
            />

            <div className="upload-content">
                <p className="upload-text">
                    Drag & drop files anywhere or <span>click to upload</span>
                </p>
                {uploadError && <p className="field-error-text">{uploadError}</p>}
            </div>
        </div>
    );
}