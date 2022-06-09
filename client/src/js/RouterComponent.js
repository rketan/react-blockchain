import React from "react"
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import ManufacturerDashboard from "./manufacturer/ManufacturerDashboard";
import SignUp from "./SignUp";
import Login from "./Login";
import DistributorDashboard from "./distributor/DistributorDashboard";
import VendorDashboard from "./vendor/VendorDashboard";
import CustomerDashboard from "./customer/CustomerDashboard";
import VendorViewOrders from "./vendor/ViewOrders";
import VendorChangeProductStatus from "./vendor/ChangeProductStatus";

export default function router() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Login/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={<SignUp/>}/>

                <Route path="/manufacturer" element={<ManufacturerDashboard/>}/>
                <Route path="/distributor" element={<DistributorDashboard/>}/>


                <Route path="/vendor" element={<VendorDashboard/>}/>
                <Route path="/vendor/view-current-orders" element={<VendorViewOrders/>}/>
                <Route path="/vendor/change-product-status" element={<VendorChangeProductStatus/>}/>


                <Route path="/customer" element={<CustomerDashboard/>}/>
            </Routes>
        </Router>)
}
