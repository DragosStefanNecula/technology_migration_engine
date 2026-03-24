export default function Button({
    children,
    onClick,
    variant = "white",
    disabled = false,
    style = {}
}) {
    const variants = {
        green: {
            background: "#22c55e",
            color: "white",
            border: "1px solid #16a34a"
        },
        red: {
            background: "#ef4444",
            color: "white",
            border: "1px solid #dc2626"
        },
        yellow: {
            background: "#facc15",
            color: "#333",
            border: "1px solid #eab308"
        },
        white: {
            background: "white",
            color: "#333",
            border: "1px solid #ddd"
        }
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={variants[variant]}
            className="button-base"
            onMouseEnter={e => {
                if (!disabled) e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            {children}
        </button>
    );
}