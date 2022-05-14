// import {useNavigate} from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router";
import { Button } from "react-bootstrap";
import React, { useContext } from "react";
import { AppContext } from '../App'

function ManufacturerDashboard() {
    const { web3, contract, accountId } = useContext(AppContext);
    const [account, setAccount] = accountId;

    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        console.log("Debug: Account ID", account);
    }, []);

    return (
        <>

            <h3 style={{ position: 'fixed', top: 30, left: 1200 }}>
                Welcome Manufacturer {location.state.userName}
            </h3>
            <div className="inner2">
                <Button className="upload-file-btn"
                    style={{ position: "fixed", left: "500px", top: "150px" }}
                    onClick={() => navigate("/manufacturer/view-products")}>View Products
                </Button>

                <Button className="upload-file-btn"
                    style={{ position: "fixed", left: "800px", top: "150px" }}
                    onClick={() => navigate("/manufacturer/add-product")}>Add Product
                </Button>

                <Button className="upload-file-btn"
                    style={{ position: "fixed", left: "1100px", top: "150px" }}
                    onClick={() => navigate("/manufacturer/change-product-status")}>Change Product status
                </Button>

                <Button className="upload-file-btn"
                    style={{ position: "fixed", left: "1400px", top: "150px" }}
                    onClick={() => navigate("/manufacturer/view-current-orders")}>View current orders
                </Button>

            </div>
        </>
    )
}

export default ManufacturerDashboard;