import React from "react"
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import ViewProducts from "./manufacturer/ViewProducts";
import ViewOrders from "./manufacturer/ViewOrders";
import ChangeProductStatus from "./manufacturer/ChangeStatus";
import AddProduct from "./manufacturer/AddProducts";
import ManufacturerDashboard from "./manufacturer/ManufacturerDashboard";
import LandingPage from "./LandingPage";
import DistributorDashboard from "./distributor/DistributorDashboard";
import VendorDashboard from "./vendor/VendorDashboard";
import CustomerDashboard from "./customer/CustomerDashboard";
import Login from "./Login";

export default function router() {
    return (
        <Router>
            <Routes>
                {/*TODO: Add nested routes in nested files*/}

                <Route exact path="/" element={<Login/>}/>
                <Route exact path="/login" element={<Login/>}/>
                <Route exact path="/signup" element={<LandingPage/>}/>


                <Route path="/manufacturer" element={<ManufacturerDashboard/>}/>
                <Route path="/manufacturer/view-products" element={<ViewProducts/>}/>
                <Route path="/manufacturer/add-product" element={<AddProduct/>}/>
                <Route path="/manufacturer/change-product-status" element={<ChangeProductStatus/>}/>
                <Route path="/manufacturer/view-current-orders" element={<ViewOrders/>}/>


                <Route path="/distributor" element={<DistributorDashboard/>}/>
                {/*TODO: Add Distributor nested paths*/}

                <Route path="/vendor" element={<VendorDashboard/>}/>
                {/*TODO: Add Vendor nested paths*/}

                <Route path="/customer" element={<CustomerDashboard/>}/>
                {/*TODO: Add Customer nested paths*/}

            </Routes>
        </Router>)
}
