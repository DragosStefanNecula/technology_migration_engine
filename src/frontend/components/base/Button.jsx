import "#src/frontend/components/base/Button.css";
import { SmartTooltip } from "#src/frontend/components/base/SmartTooltip";

export default function Button({
    children,
    onClick,
    variant = "white",
    disabled = false,
    selected = false,
    clickable = true,
    reason,
    tooltip,
    style = {},
    className = ""
}) {
    const isInteractive = !disabled && clickable;

    const classNames = [
        "button-base",
        "button",
        `button-${variant}`,
        !clickable && "button-static",
        disabled && "button-disabled",
        selected && "button-selected",
        className
    ].filter(Boolean).join(" ");

    return (
        <SmartTooltip disabled={isInteractive && tooltip == undefined} content={tooltip ? tooltip : reason}>
            <button
                onClick={isInteractive ? onClick : undefined}
                disabled={disabled}
                style={style}
                className={classNames}
            >
                {children}
            </button>
        </SmartTooltip>
    );
}
