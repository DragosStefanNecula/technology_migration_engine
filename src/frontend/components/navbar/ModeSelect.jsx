import { useEffect } from "react";
import { useAppContext } from "#src/frontend/renderer/renderer";
import Button from "#src/frontend/components/base/Button";
import { OutlinedGroup } from "#src/frontend/components/base/OutlinedGroup";
import "#src/frontend/components/navbar/ModeSelect.css";

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
        <OutlinedGroup label="Mode">
            <Button
                onClick={() => handleSelect("1stPass")}
                selected={mode === "1stPass"}
                className="mode-select-btn"
                tooltip="Manually choose between the first and second pass of the code migration. 
The first pass is powered both by transpiler logic and large language model.
The second pass is another pass over using only large language model."
            >
                Detailed
            </Button>

            <Button
                onClick={() => handleSelect("2ndPass")}
                selected={mode === "2ndPass"}
                className="mode-select-btn"
                tooltip="Automatically go through both the first pass and the second pass of the migration, stops decision fatigue."
            >
                Full Pass
            </Button>
        </OutlinedGroup>
    );
};
