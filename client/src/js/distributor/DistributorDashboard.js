import {useLocation, useNavigate} from "react-router-dom";
import React from "react";
import NavComponent from "../NavComponent";
import DistributorViewOrders from "./ViewOrders";

function DistributorDashboard() {
    const navigate = useNavigate();
    const location = useLocation();


    return (
        <>
            <NavComponent 
            username={location.state.userName}
            entity={"Distributor"}
            />
            
            <DistributorViewOrders />
        </>
    )
}
export default DistributorDashboard;