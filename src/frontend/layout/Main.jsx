import React from 'react'
import "#src/frontend/layout/Main.css";
import Navbar from '#src/frontend/layout/Navbar';
import Content from '#src/frontend/layout/Content';
import Footer from '#src/frontend/layout/Footer';

const Main = () => {
  return (
    <div className="app-container">
      <Navbar/>
      <Content/>
      <Footer/>
    </div>
  )
}

export default Main