import { Container} from "react-bootstrap";
import React from "react";
import Navbar from 'react-bootstrap/Navbar'
import logo from '../static/img/blockchain.jpg'

function NavComponent(props) {
    return (
        <>
           <Navbar bg="dark" variant="dark" fixed="top">
    <Container>
      <Navbar.Brand style={{marginLeft:"12px"}}>
        <img
          alt=""
          src={logo}
          width="70"
          height="70"
          className="d-inline-block align-top"
          style={{ borderRadius: "50%", float:"left" }}
        />{' '}
      <div style={{ marginTop:"12px", float:"right", marginLeft:"10px", fontSize:"32px" }}> 
      ZotChain </div>
      </Navbar.Brand>

      <div style={{ marginTop:"12px", fontSize:"32px", color:"white" }}> 
      {props.entity} Dashboard </div>


      <div style={{ marginTop:"12px", fontSize:"32px", color:"white" }}> 
      Hi, {props.username} </div>

    </Container>
  </Navbar>
        </>
    )
}

export default NavComponent;