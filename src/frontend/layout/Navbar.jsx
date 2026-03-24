import React from "react";
import AgentBar from "../components/agent/AgentBar";
import { ModeSelect } from "../components/base/ModeSelect";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <h2>Technology Migration Engine</h2>
            </div>
            <ul className="navbar-right">
                <ModeSelect />
                <AgentBar />
            </ul>
        </nav>
    );
}