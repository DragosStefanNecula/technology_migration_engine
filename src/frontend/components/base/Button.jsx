export default function Button({
    children,
    onClick,
    variant = "white",
    disabled = false,
    clickable = true,
    style = {}
}) {
    const isInteractive = !disabled && clickable;

    const classNames = [
        "button-base",
        "button",
        `button-${variant}`,          
        !clickable && "button-static",
        disabled && "button-disabled" 
    ].filter(Boolean).join(" ");

    return (
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
    );
}