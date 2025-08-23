import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";



const AppRouter = () => {
  return (
    <Router>
      {/* Navbar on all pages */}
      <Navbar />

      {/* Routes */}
     
    </Router>
  );
};

export default AppRouter;
