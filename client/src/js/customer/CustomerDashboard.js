import {useLocation, useNavigate} from "react-router-dom";
import {Button} from "react-bootstrap";
import React from "react";

function CustomerDashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <>


            <h3 style={{position: 'fixed', top: 30, left: 1200}}>
                Welcome Customer {location.state.userName}
            </h3>
            <div className="inner2">

                <Button className="upload-file-btn"
                        style={{position: "fixed", left: "500px", top: "150px"}}
                        onClick={() => navigate("/customer/view-product-history")}>View Order History
                </Button>
            </div>
        </>
    )
}

export default CustomerDashboard;