import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../css/Login.css";
import {useNavigate} from "react-router-dom";

function LandingPage() {
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [userType, setUserType] = useState("");
    const VENDOR = "vendor";
    const MANUFACTURER = "manufacturer";
    const DISTRIBUTOR = "distributor";
    const CUSTOMER = "customer";


    function validateForm() {
        return userName.length > 0 && userType.length > 0;
    }

    function handleSubmit(event) {

        event.preventDefault();
        switch (userType) {
            case VENDOR:
                navigate("/vendor", {state: {"userName": userName}});
                break;
            case MANUFACTURER:
                navigate("/manufacturer", {state: {"userName": userName}});
                break;
            case DISTRIBUTOR:
                navigate("/distributor", {state: {"userName": userName}});
                break;
            case CUSTOMER:
                navigate("/customer", {state: {"userName": userName}});
                break;
            default:
                console.log("Invalid user type");
        }
    }

    return (
        <div className="Login">
            <Form onSubmit={handleSubmit}>
                <Form.Group size="lg" controlId="email">
                    <Form.Label>User Name</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group size="lg" controlId="user-type">
                    <Form.Label>User Type</Form.Label>
                    <Form.Select aria-label="Default select example" value={userType}
                                 onChange={(e) => setUserType(e.target.value)}>
                        <option>User type</option>
                        <option value="vendor">Vendor</option>
                        <option value="manufacturer">Manufacturer</option>
                        <option value="distributor">Distributor</option>
                        <option value="customer">Customer</option>
                    </Form.Select>
                </Form.Group>
                <Button block size="lg" type="submit" disabled={!validateForm()}>
                    Login
                </Button>
            </Form>
        </div>
    );
}

export default LandingPage;