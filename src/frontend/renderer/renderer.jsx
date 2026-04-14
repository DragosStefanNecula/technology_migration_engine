import { createRoot } from "react-dom/client";
import { useEffect, createContext, useContext, useState } from "react";
import Main from "#src/frontend/layout/Main";
import { ToastProvider } from "#src/frontend/components/base/Toast";

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [selectedAgent, setSelectedAgent] = useState(() => {
        return localStorage.getItem("selectedAgent") || null;
    })
    const [mode, setMode] = useState(() => {
        return localStorage.getItem("mode") || "1stPass";
    });
    const [output, setOutput] = useState(null);
    const [processing, setProcessing] = useState(false);

    return (
        <AppContext.Provider
            value={{ selectedAgent, setSelectedAgent, mode, setMode, output, setOutput, processing, setProcessing }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);

const App = () => {
    return <Main />;
};

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <AppProvider>
        <ToastProvider>
            <App />
        </ToastProvider>
    </AppProvider>,
);
