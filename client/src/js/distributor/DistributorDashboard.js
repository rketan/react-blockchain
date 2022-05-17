import {useLocation, useNavigate} from "react-router-dom";
import {Button} from "react-bootstrap";
import React from "react";

function DistributorDashboard() {
    const navigate = useNavigate();
    const location = useLocation();


    return (
        <>

            <h3 style={{position: 'fixed', top: 30, left: 1200}}>
                Welcome Distributor {location.state.userName}
            </h3>
            <div className="inner2">

                <Button className="upload-file-btn"
                        style={{position: "fixed", left: "800px", top: "150px"}}
                        onClick={() => navigate("/distributor/view-current-orders")}>View current orders
                </Button>

            </div>
        </>
    )
}
export default DistributorDashboard;