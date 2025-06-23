import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import LeftSideBar from "./LeftSideBar";

const MainLayout = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
     
        <div className=" fixed top-[64px] left-0 ">
       
          <LeftSideBar />
        </div>

      
        <div className="md:ml-[20%]  w-full md:w-[80%]  ">
        
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;