import React from "react";

export function AutoUpdatingWidget({ setTruth }) {
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        const id = setInterval(() => {
            setCount((c) => c + 1);
        }, 1000);

        return () => clearInterval(id);
    }, []);

    React.useEffect(() => {
        if (count === 5) setTruth(true);

    }, [count]);
    return (
        <div style={{ display: "flex", gap: "6px" }}>
            <span>⏱ Count: {count}</span>
        </div>
    );
}