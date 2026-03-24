import { createRoot } from "react-dom/client";
import { createContext, useContext, useState } from "react";
import Main from "../layout/Main";

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [mode, setMode] = useState("1stPass");

    return (
        <AppContext.Provider
            value={{ selectedAgent, setSelectedAgent, mode, setMode }}
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
        <App />
    </AppProvider>,
);
