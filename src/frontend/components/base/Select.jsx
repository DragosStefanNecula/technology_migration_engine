import React from "react";

export default function Select({
    options = [],
    value,
    onChange,
    disabled = false,
    placeholder = "Select...",
    style,
    className = ""
}) {

    const showPlaceholder = value === "" || value == null;

    return (
        <select
            value={showPlaceholder ? "" : value}
            onChange={onChange}
            disabled={disabled}
            className={`button-base${className ? ` ${className}` : ""}`}
            style={style}
        >
            {showPlaceholder && (
                <option
                    value=""
                    disabled
                    hidden
                    style={{ color: "#999" }}
                >
                    {placeholder}
                </option>
            )}
            {options.map((opt, idx) => (
                <option key={idx} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}
