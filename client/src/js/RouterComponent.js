import React from "react"
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
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

export default function router() {
    return (
    <Router>
        <Routes>
            {/*TODO: Add nested routes in nested files*/}

            <Route exact path="/" element={<Login/>}/>
            <Route path="/signup" element={<SignUp/>}/>}

            <Route path="/manufacturer" element={<ManufacturerDashboard/>}/>
            <Route path="/manufacturer/view-products" element={<ViewProducts/>}/>
            <Route path="/manufacturer/add-product" element={<AddProduct/>}/>
            <Route path="/manufacturer/change-product-status" element={<ChangeProductStatus/>}/>
            <Route path="/manufacturer/view-current-orders" element={<ViewOrders/>}/>


            <Route path="/distributor" element={<DistributorDashboard/>}/>
            <Route path="/distributor/change-product-status" element={<DistributorChangeProductStatus/>}/>
            <Route path="/distributor/view-current-orders" element={<DistributorViewOrders/>}/>

            {/*TODO: Add Distributor nested paths*/}

            <Route path="/vendor" element={<VendorDashboard/>}/>
            {/*TODO: Add Vendor nested paths*/}

            <Route path="/customer" element={<CustomerDashboard/>}/>
            {/*TODO: Add Customer nested paths*/}

        </Routes>
    </Router>)
}
