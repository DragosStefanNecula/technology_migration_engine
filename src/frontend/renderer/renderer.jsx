import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import FileUpload from '../components/FileUpload';

const App = () =>{

  const [value, setValue] = useState('');

  globalThis.electronAPI.sendReady();

  useEffect(() => {
    console.log("yes")
    if (globalThis.electronAPI) {console.log("yes")
      globalThis.electronAPI.onSetValue((_, value) => { 
        setValue(value);
      });
    }
  }, []);

  return (
    <div>
      <h1>Value from Electron Main:</h1>
      <p>{value}</p>
      <FileUpload></FileUpload>
    </div>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App/>);