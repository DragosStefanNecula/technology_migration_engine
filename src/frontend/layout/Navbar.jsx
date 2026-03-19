import React from "react";
import AgentBar from "../components/agent/AgentBar";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>Technology Migration Engine</h2>
      </div>
      <ul className="navbar-right">
        <AgentBar/>
      </ul>
    </nav>
  );
}