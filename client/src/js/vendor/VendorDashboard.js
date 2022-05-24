import {useLocation, useNavigate} from "react-router-dom";
import React from "react";
import NavComponent from "../NavComponent";
import VendorViewOrders from "./ViewOrders"

function VendorDashboard() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <NavComponent 
            username={location.state.userName}
            entity={"Vendor"}
            />
            
            <VendorViewOrders />
        </>
    )
}
export default VendorDashboard;