import React from "react"
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import ManufacturerDashboard from "./manufacturer/ManufacturerDashboard";
import SignUp from "./SignUp";
import Login from "./Login";
import DistributorDashboard from "./distributor/DistributorDashboard";
import VendorDashboard from "./vendor/VendorDashboard";
import CustomerDashboard from "./customer/CustomerDashboard";
import VendorViewOrders from "./vendor/ViewOrders";
import VendorChangeProductStatus from "./vendor/ChangeProductStatus";

export default function router() {

    const VENDOR = "vendor";
    const MANUFACTURER = "manufacturer";
    const DISTRIBUTOR = "distributor";
    const CUSTOMER = "customer";

    function Guard(props) {
        if (localStorage.getItem("loggedIn") !== "true") {
            alert("You are logged out, please login");
            localStorage.clear();
            return (<Navigate replace={true} to="/"/>)
        } else if (localStorage.getItem("userType") !== props.path) {
            alert("You are not authorized to view this page. Redirecting back to your dashboard")
            let path = "/" + localStorage.getItem("userType");
            return (<Navigate replace={true} to={path} state={{"userName": localStorage.getItem("userName")}}/>)
        } else {
            return (
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

                <Route path="/manufacturer" element={<Guard element={<ManufacturerDashboard/>} path={MANUFACTURER}/>}/>
                <Route path="/distributor" element={<Guard element={<DistributorDashboard/>} path={DISTRIBUTOR}/>}/>
                <Route path="/vendor" element={<Guard element={<VendorDashboard/>} path={VENDOR}/>}/>
                <Route path="/vendor/view-current-orders" element={<VendorViewOrders/>}/>
                <Route path="/vendor/change-product-status" element={<VendorChangeProductStatus/>}/>
                <Route path="/customer" element={<Guard element={<CustomerDashboard/>} path={CUSTOMER}/>}/>
            </Routes>
        </Router>)
}
