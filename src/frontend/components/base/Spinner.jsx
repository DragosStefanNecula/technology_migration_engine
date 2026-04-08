import "./Spinner.css";

export default function Spinner({ size = 24, thickness = 3 }) {
    return (
        <div
            className="spinner"
            style={{
                width: size,
                height: size,
                borderWidth: thickness,
            }}
        />
    );
}
