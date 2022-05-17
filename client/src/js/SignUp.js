import React, {useContext, useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../css/Login.css";
import {useNavigate} from "react-router";
import {AppContext} from './App'

function SignUp() {
    const { web3, contract, accountId } = useContext(AppContext);
    const [localWeb3, setLocalWeb3] = web3;
    const [localContract, setLocalContract] = contract;
    const [account, setAccount] = accountId;

    React.useEffect(() => {
        const fetchAccounts = async () => {
            if (localWeb3 !== undefined) {
                // Use web3 to get the user's accounts.
                return await localWeb3.eth.getAccounts();
            }

        };
        fetchAccounts().then(console.log).catch(console.error);
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

    async function assignRole(ethId, role) {

        if (localContract !== undefined || localContract.methods !== undefined) {
            if (role === MANUFACTURER) {
                const isManufacturer = await localContract.methods.isManufacturer(ethId).call();
                if (!isManufacturer) {
                    await localContract.methods.addManufacturer(ethId).send({from: ethId});
                }
                console.log(await localContract.methods.isManufacturer(ethId).call());
            } else if (role === DISTRIBUTOR) {
                const isDistributor = await localContract.methods.isDistributor(ethId).call();
                if (!isDistributor) {
                    await localContract.methods.addDistributor(ethId).send({from: ethId});
                }
                console.log(await localContract.methods.isDistributor(ethId).call());

            } else if (role === VENDOR) {
                const isVendor = await localContract.methods.isVendor(ethId).call();
                if (!isVendor) {
                    const assignMan = await localContract.methods.addVendor(ethId).send({from: ethId});
                }
            } else {
                alert("error, invalid role")
            }
        }
        console.log(await localContract.methods.getRole(userEthereumId).call());
    }

    function handleSubmit(event) {
        event.preventDefault();
        setAccount(userEthereumId);
        switch (userType) {
            case VENDOR:
                assignRole(userEthereumId, VENDOR);
                navigate("/vendor", {state: {"userName": userName}});
                break;
            case MANUFACTURER:
                assignRole(userEthereumId, MANUFACTURER);
                navigate("/manufacturer", {state: {"userName": userName}});
                break;
            case DISTRIBUTOR:
                assignRole(userEthereumId, DISTRIBUTOR);
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
        <div className="Login" >
            <Form onSubmit={handleSubmit} className="card p-4 bg-light">
                <Form.Group size="lg" controlId="userName">
                    <h3 style={{color: "black", textAlign: "center", alignSelf: "center"}}>Signup</h3>
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
                <br/>
                <Button class="btn btn-primary" block size="lg"  type="submit" disabled={!validateForm()}>
                    Sign up
                </Button>
            </Form>
        </div>
    );
}

export default SignUp;