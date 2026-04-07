import { SmartTooltip } from "./SmartTooltip";

export default function Button({
    children,
    onClick,
    variant = "white",
    disabled = false,
    selected = false,
    clickable = true,
    reason,
    tooltip,
    style = {}
}) {
    const isInteractive = !disabled && clickable;

    const classNames = [
        "button-base",
        "button",
        `button-${variant}`,          
        !clickable && "button-static",
        disabled && "button-disabled",
        selected && "button-selected"
    ].filter(Boolean).join(" ");

    return (
        <SmartTooltip disabled={isInteractive && tooltip == undefined} content={tooltip ? tooltip : reason}>
            <button
                onClick={isInteractive ? onClick : undefined}
                disabled={disabled}
                style={style}
                className={classNames}
                onMouseEnter={e => {
                    if (isInteractive) {
                        e.currentTarget.style.transform = "translateY(-1px)";
                    }
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                }}
            >
                {children}
            </button>
        </SmartTooltip> 
    );
}