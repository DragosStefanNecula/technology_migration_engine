import { useEffect } from "react";
import { useAppContext } from "../../renderer/renderer";
import Button from "../base/Button";
import { SmartTooltip } from "../base/SmartTooltip";

export const ModeSelect = () => {
    const { mode, setMode } = useAppContext();

    const handleSelect = (newMode) => {
        if (mode !== newMode) {
            setMode(newMode);
        }
    };

    useEffect(() => {
        localStorage.setItem("mode", mode);
    }, [mode]);

    return (
        <div style={{ display: "flex", gap: 8 }}>
            <Button
                onClick={() => handleSelect("1stPass")}
                selected={mode === "1stPass"}
                style={{ width: "100px" }}
                tooltip="Manually choose between the first and second pass of the code migration. 
The first pass is powered both by transpiler logic and large language model.
The second pass is another pass over using only large language model."
            >
                Detailed
            </Button>

            <Button
                onClick={() => handleSelect("2ndPass")}
                selected={mode === "2ndPass"}
                style={{ width: "100px" }}
                tooltip="Automatically go through both the first pass and the second pass of the migration, stops decision fatigue."
            >
                Full Pass
            </Button>
        </div>
    );
};