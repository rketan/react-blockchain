import React from "react"
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';

import ViewProducts from "./manufacturer/ViewProducts";
import ViewOrders from "./manufacturer/ViewOrders";
import ChangeProductStatus from "./manufacturer/ChangeStatus";
import AddProduct from "./manufacturer/AddProducts";
import ManufacturerDashboard from "./manufacturer/ManufacturerDashboard";
import SignUp from "./SignUp";
import Login from "./Login";
import DistributorDashboard from "./distributor/DistributorDashboard";
import VendorDashboard from "./vendor/VendorDashboard";
import CustomerDashboard from "./customer/CustomerDashboard";
import DistributorChangeProductStatus from "./distributor/ChangeProductStatus";
import DistributorViewOrders from "./distributor/ViewOrders";
import VendorViewOrders from "./vendor/ViewOrders";
import VendorChangeProductStatus from "./vendor/ChangeProductStatus";

export default function router() {

    const NULL_USER = "0x0000000000000000000000000000000000000000";
    const VENDOR = "vendor";
    const MANUFACTURER = "manufacturer";
    const DISTRIBUTOR = "distributor";
    const CUSTOMER = "customer";

    function Guard(props){
        if(localStorage.getItem("loggedIn")!=="true"||localStorage.getItem("userType")!==props.path){
            return (<Navigate replace to="/"/>)
        }
        else{
            return(
                <div>
                {props.element}
                </div>
            )
        }
        
    }
    
    return (
        <Router>
            <Routes>
                {/*TODO: Add nested routes in nested files*/}
                <Route exact path="/" element={<Login/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={<SignUp/>}/>

                <Route path="/manufacturer" element={<Guard element={<ManufacturerDashboard/>} path={MANUFACTURER}/> }/>
                <Route path="/distributor" element={<Guard element={<DistributorDashboard/>} path={DISTRIBUTOR}/>}/>
                <Route path="/vendor" element={<Guard element={<VendorDashboard/>} path={VENDOR}/>}/>
                <Route path="/vendor/view-current-orders" element={<VendorViewOrders/>}/>
                <Route path="/vendor/change-product-status" element={<VendorChangeProductStatus/>}/>
                <Route path="/customer" element={<Guard element={<CustomerDashboard/>} path={CUSTOMER}/>}/>
            </Routes>
        </Router>)
}
