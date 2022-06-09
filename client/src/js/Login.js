import React, {useContext, useState, useEffect, useRef} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../css/Login.css";
import {AppContext} from "./App";
import {useNavigate} from "react-router";
import logo from '../static/img/blockchain.jpg'


function Login() {

    const NULL_USER = "0x0000000000000000000000000000000000000000";
    const VENDOR = "vendor";
    const MANUFACTURER = "manufacturer";
    const DISTRIBUTOR = "distributor";
    const CUSTOMER = "customer";

    const {web3, contract, accountId} = useContext(AppContext);
    const localWeb3 = web3[0];
    const setAccount = accountId[1];
    const localContract = contract[0];


    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const formRef = useRef(null);


    function setStorage(){
        localStorage.setItem("userName",userName);
        localStorage.setItem("password",password);
        localStorage.setItem("loggedIn","true");
    }

    useEffect(()=>{
        if(localStorage.getItem("loggedIn")==="true"){
            switch (localStorage.getItem("userType")) {
                case VENDOR:
                    navigate("/vendor", {state: {"userName": localStorage.getItem("userName")}});
                    break;
                case MANUFACTURER:
                    navigate("/manufacturer", {state: {"userName": localStorage.getItem("userName")}});
                    break;
                case DISTRIBUTOR:
                    navigate("/distributor", {state: {"userName": localStorage.getItem("userName")}});
                    break;
                case CUSTOMER:
                    navigate("/customer", {state: {"userName": localStorage.getItem("userName")}});
                    break;
                default:
                    console.log("Invalid user");
            }
        }
    },[]);

    function validateForm() {
        return userName.length > 0 && password.length > 5;
    }

    async function getUserType(metamaskAccountId) {

        const userId = await localContract.methods.login(userName, password).call();
        if (userId === NULL_USER) {
            alert("User not exists/Invalid Password");
            throw new Error("User not exists/Invalid Password");
        }
        if (userId !== metamaskAccountId) {
            alert("User not signed up");
            throw new Error("User ethereum id not linked with metamask");
        }
        const roleName = await localContract.methods.getRole(userId).call();
        console.log(roleName);
        if (roleName !== undefined && roleName !== '') {
            setAccount(userId);
            localStorage.setItem("USER_NAME", userName);
            return roleName;
        }
        alert("User not signed up")
        throw new Error("User not exists");
    }

    function routeUser(userType) {
        console.log(userType)
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
                console.log("Invalid user");
        }
    }

    async function handleLogin(event) {
        event.preventDefault();
        const fetchAccounts = async () => {
            if (localWeb3 !== undefined) {
                const accounts = await localWeb3.eth.requestAccounts();
                return accounts[0];
            }
        };
        let userType = await fetchAccounts().then(getUserType).catch(console.error);
        setStorage();
        localStorage.setItem("userType", userType);
        routeUser(userType);
        // Refresh Page that is redirected to
        window.location.reload(false);
    }

    return (
        
        <div className="Login">
            <img
          alt=""
          src={logo}
          width="150"
          height="150"
          className="d-inline-block align-top"
          style={{ borderRadius: "50%", marginTop:'2%', marginLeft:'3%'}}
        />

<h1 style={{textAlign: "center", alignSelf: "center", top:'70px', position:'fixed', left:'800px', fontSize:'78px'}}> ZotChain
            </h1>
            <Form ref={formRef} onSubmit={handleLogin} className="card p-4 bg-light">
                <Form.Group size="lg" controlId="userName">
                    <h3 style={{color: "black", textAlign: "center", alignSelf: "center"}}>Login</h3>
                    <Form.Label>User Name</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </Form.Group>
                <br/>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        autoFocus
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <br/>
                <Button class="btn btn-secondary" block size="lg" type="submit" disabled={!validateForm()}>
                    Login
                </Button>
                <br/>
                <span style={{color: "black", textAlign: "center", alignSelf: "center"}}>
                    &nbsp; &nbsp; &nbsp;New user? &nbsp;
                    <Button class="btn btn-primary" block size="lg"
                            style={{height: 44, width: 100, textAlign: "center", fontSize: 18}}
                            onClick={() => navigate("/signup")}>
                        Signup
                    </Button>
                </span>


            </Form>
            <br/>

        </div>
    )
        ;
}

export default Login;