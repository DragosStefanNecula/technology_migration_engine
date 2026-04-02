export default function Spinner({ size = 24, thickness = 3 }) {
    const style = {
        width: size,
        height: size,
        border: `${thickness}px solid #ccc`,
        borderTop: `${thickness}px solid #333`,
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
    };

    return (
        <>
            <div style={style} />
            <style>
            {`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}
            </style>
        </>
    );
}
