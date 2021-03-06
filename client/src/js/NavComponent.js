import { Container} from "react-bootstrap";
import React from "react";
import Navbar from 'react-bootstrap/Navbar'
import logo from '../static/img/blockchain.jpg'
import Button from "react-bootstrap/Button";


import {useNavigate} from "react-router";

function NavComponent(props) {

  const navigate = useNavigate();

  function logOut(){
    localStorage.clear();
    navigate("/");
  }

    return (
        <>
  <Navbar bg="dark" variant="dark" fixed="top">
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

      <div style={{ marginTop:"12px", fontSize:"32px", marginLeft:"auto", color:"white" }}> 
      {props.entity} Dashboard </div>


      <div style={{ marginTop:"12px", fontSize:"32px", marginLeft:"auto",marginRight:"24px",color:"white" }}> 
      Hi, {props.username}</div>

      {/*<Button class="btn btn-secondary" block size="lg">   fontSize:"32px" color:"white" */}

      <Button class="btn btn-secondary" block size="lg" style={{ marginTop:"12px", marginLeft:"12px",marginRight:"24px"}} onClick={()=>logOut()}>
        Log Out
      </Button>
      

  </Navbar>
        </>
    )
}

export default NavComponent;