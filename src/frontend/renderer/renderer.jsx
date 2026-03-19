import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import Main from '../layout/Main';

const App = () => { return <Main/> };

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App/>);