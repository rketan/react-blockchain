import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../css/Login.css";
import {useNavigate} from "react-router";
import getWeb3 from "./getWeb3";
import ProductTrackingContract from "../contracts/ProductTracking.json";

function LandingPage() {

    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState(null);

    const [contract, setContract] = useState(null);

    const [products, setProducts] = useState([]);


    React.useEffect(() => {
        // Get network provider and web3 instance.

        const fetchWeb3 = async () => {
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();


            let deployedNetwork = ProductTrackingContract.networks[networkId];
            const productTrackingInstance = new web3.eth.Contract(
                ProductTrackingContract.abi,
                deployedNetwork && deployedNetwork.address
            );
            setWeb3(web3);
            setAccounts(accounts);
            setContract(productTrackingInstance);
        };
        fetchWeb3().catch(console.error);
    }, []);


    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [userType, setUserType] = useState("");
    const [userEthereumId, setUserEthereumId] = useState("");

    const VENDOR = "vendor";
    const MANUFACTURER = "manufacturer";
    const DISTRIBUTOR = "distributor";
    const CUSTOMER = "customer";


    function validateForm() {
        return userName.length > 0 && userType.length > 0 && userEthereumId;
    }

    async function assignRole(ethId) {
        // get man list and check if this account is assigned the correct role
        const isMan = contract.methods.isManufacturer(ethId).call();
        console.log("Debug : isMan : ", isMan);

        if (!isMan) {
            // assign manufacturer role to this account
            const assignMan = await contract.methods.addManufacturer(ethId).call();
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        switch (userType) {
            case VENDOR:
                navigate("/vendor", {state: {"userName": userName}});
                break;
            case MANUFACTURER:
                assignRole(userEthereumId);
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
                <Form.Group size="lg" controlId="userName">
                    <Form.Label>User Name</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group size="lg" controlId="user-ethereum-id">
                    <Form.Label>User Ethereum ID</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={userEthereumId}
                        onChange={(e) => setUserEthereumId(e.target.value)}
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
                <Button class="btn btn-primary" block size="lg" type="submit" disabled={!validateForm()}>
                    Login
                </Button>
            </Form>
        </div>
    );
}

export default LandingPage;