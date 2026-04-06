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
                selected={mode === "1stPass"}
                style={{ width: "100px" }}
            >
                Detailed
            </Button>

            <Button
                onClick={() => handleSelect("2ndPass")}
                selected={mode === "2ndPass"}
                style={{ width: "100px" }}
            >
                Full Pass
            </Button>
        </div>
    );
};