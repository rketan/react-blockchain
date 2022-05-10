import React, {Component} from "react";

import "../css/App.css";
import RouterComponent from "./RouterComponent";
import {Container} from 'react-bootstrap';
import logo from '../static/img/blockchain.jpg'

class App extends Component {
    render() {
        return (
            <div className="bg-image">
                <h1 style={{position: 'fixed', top: 30, left: 30}}>
                    <img src={logo} alt='logo' width='150'
                         style={{height: "180px", width: "200px", borderRadius: "50%"}}/>
                </h1>

                <h1 style={{position: 'fixed', top: 30, left: 900}}>
                    ZotChain
                </h1>
                <Container
                    className="d-flex align-items-center justify-container-center"
                    style={{minHeight: "100vh", position: "relative"}}>
                    <div className="w-100 signup-container" style={{maxWidth: "400px"}}>
                        {<RouterComponent/>}
                    </div>
                </Container>
            </div>
        )
    }
}

export default App;
