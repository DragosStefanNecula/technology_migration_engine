import { useState, useEffect } from 'react';

function FileUpload() {

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const content = await file.text(); 
    globalThis.electronAPI.uploadFile({ name: file.name, content: content });
  };

  const [value, setValue] = useState('');

  globalThis.electronAPI.sendReady();

  useEffect(() => {
    if (globalThis.electronAPI) {console.log("yes")
      globalThis.electronAPI.onSetValue((_, value) => { 
        setValue(value);
      });
    }
  }, []);

  return (
    <div>
      <p>{value}</p>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
}

export default FileUpload;
