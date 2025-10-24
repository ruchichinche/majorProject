import React from "react";
import Login from "./pages/login";
import {ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from "react";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import AllAppointmentt from "./pages/admin/AllAppointment";
import AddDoctor from "./pages/admin/AddDoctor";
import DoctorList from "./pages/admin/DoctorList";
//import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
const App=()=>{
  const {aToken}=useContext(AdminContext)
  return aToken?(
    <div className="bg-[#F8F9FD]">
    
      <ToastContainer/>
      <Navbar/>
     <div className="flex items-start">
      <Sidebar/>
      <Routes>
        <Route path="/" element={<></>}/>
        <Route path="/admin-dashboard" element={<Dashboard/>}/>
        <Route path="/all-appointment" element={<AllAppointmentt/>}/>
        <Route path="/add-doctor" element={<AddDoctor/>}/>
        <Route path="/doctor-list" element={<DoctorList/>}/>

      </Routes>
     </div>
    </div>
  ):(
    <>
     <Login/>
      <ToastContainer/>
    </>
  )
}

export default App