import React from 'react'
import "./Main.css";
import Navbar from './Navbar';
import Content from './Content';
import Footer from './Footer';

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