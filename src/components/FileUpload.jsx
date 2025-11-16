import React, { useState } from 'react';

function FileUpload() {
  const [status, setStatus] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const content = await file.text(); 
    globalThis.electronAPI.uploadFile({ name: file.name, content: content });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <p>{status}</p>
    </div>
  );
}

export default FileUpload;
