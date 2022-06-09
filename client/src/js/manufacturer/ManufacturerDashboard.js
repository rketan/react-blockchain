import { useLocation } from "react-router-dom";
import React from "react";
import ViewProducts from "./ViewProducts";
import NavComponent from "../NavComponent";

function ManufacturerDashboard() {
    const location = useLocation();

    return (
        <>
            <NavComponent 
            username={location.state.userName}
            entity={"Manufacturer"}
            />
            <ViewProducts userName={location.state.userName}/>
        </>
    )
}

export default ManufacturerDashboard;