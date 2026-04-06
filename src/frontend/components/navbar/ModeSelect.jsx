import { useAppContext } from "../../renderer/renderer";
import Button from "../base/Button";

export const ModeSelect = () => {
    const { mode, setMode } = useAppContext();

    const handleSelect = (newMode) => {
        if (mode !== newMode) {
            setMode(newMode);
        }
    };

    return (
        <div style={{ display: "flex", gap: 8 }}>
            <Button
                onClick={() => handleSelect("1stPass")}
                variant={mode === "1stPass" ? "green" : "white"}
            >
                Detailed
            </Button>

            <Button
                onClick={() => handleSelect("2ndPass")}
                variant={mode === "2ndPass" ? "green" : "white"}
            >
                Full Pass
            </Button>
        </div>
    );
};