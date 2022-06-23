import React from "react";
import logo from '../images/airbnb.png';
import { Link } from "react-router-dom";
import { Nav, Navbar, InputGroup, FormControl, Col, Form, Button } from "react-bootstrap";
import { useState } from 'react';

import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

const NavBar = () => {
    const [account, setAccount] = useState(null);
    const [checkIn, setCheckIn] = useState(new Date());
    const [checkOut, setCheckOut] = useState(new Date());
    const [destination, setDestination] = useState("New York");
    const [guests, setGuests] = useState(2);

    async function getWeb3Modal() {
        const providerOptions = {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              // Mikko's test key - don't copy as your mileage may vary
              infuraId: "78e38e6a5a0e4fdd8708de1596ddcbb1",
              rpc: {
                  1: "https://mainnet.mycustomnode.com",
                  137: "https://polygon-rpc.com",
                  80001: 'https://matic-mumbai.chainstacklabs.com',
                },
              supportedChainIds: [1, 137, 80001]
            }
          }
        };
      
        const web3Modal = new Web3Modal({
            network: 'mumbai',
            cacheProvider: true, // optional
            providerOptions, // required
            disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
        });
    
        return web3Modal;
      }
      
      async function fetchAccountData(web3) {
    
        // Get a Web3 instance for the wallet from parameter        
        // Get info for current provider 
        const chainId = await web3.eth.getChainId();    
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      }
    
      async function connect() {
        if(!window.ethereum) throw new Error("No crypto wallet found!");
        try {
           const web3Modal = await getWeb3Modal();
           const provider = await web3Modal.connect();
           const web3 = new Web3(provider);
           const chainId = await web3.eth.getChainId();
           const accounts = await web3.eth.getAccounts();
            fetchAccountData(web3);
            window.ethereum.on("accountsChanged", (accounts) => {
                fetchAccountData(web3);
            });
        } catch(err) {
          console.log("Could not get a wallet connection", err);
          return;
        }
      }
      return(
        <Navbar collapseOnSelect fixed="top" expand='xl' className="mt-3">
          <Col xs={2} className="ms-3">
          <Navbar.Brand href="/">
                <img src={logo} className="d-inline-block align-top" alt="airbnb logo"
                style={{width:'50%', height:'40%'}}
                />
            </Navbar.Brand>
          </Col>
            <Navbar.Toggle aria-controls='responsive-navbar-nav' />
            <Navbar.Collapse id='responsive-navbar-nav'>
            <Nav className="me-auto">
              <Col xs={2} className="me-1">
                <Form.Select size="lg" aria-label="Default select example" onChange={(e) => setDestination(e.target.value)}>
                <option>Location</option>
                <option value="New York">New York</option>
                <option value="London">London</option>
                <option value="Dubai">Dubai</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Taipei">Taipei</option>
                </Form.Select>
              </Col>
                   <Col xs={3} className="me-1">
                    <InputGroup size="lg">
                    <InputGroup.Text htmlFor="CheckIn">Check In</InputGroup.Text>
                    <FormControl type="date" id="CheckIn" value={checkIn.toISOString().slice(0, 10)}  
                      min={new Date().toISOString().slice(0, 10)} max="2022-12-31" 
                      onChange={(e) => {setCheckIn(new Date(e.target.value))}}
                    />
                    </InputGroup>
                   </Col>
              <Col xs={3} className="me-1">
              <InputGroup size="lg">
                    <InputGroup.Text htmlFor="CheckIn">Check Out</InputGroup.Text>
                <FormControl type="date" id="CheckOut" value={checkOut.toISOString().slice(0, 10)}  
                  min={new Date().toISOString().slice(0, 10)} max="2022-12-31" 
                  onChange={(e) => {setCheckOut(new Date(e.target.value))}}
                /> 
                </InputGroup>
              </Col>  
              <Col xs={2}>
              <InputGroup size="lg">
                <InputGroup.Text htmlFor="guests">Guests</InputGroup.Text>
                  <FormControl
                    value={guests}
                    id="guests"
                    type="text"
                    onChange={(event) => setGuests(Number(event.target.value))}
                  />
                  </InputGroup>
              </Col>
          
        {/* pass the search conditions as state to Rentals page */}
        <Link to={"/rentals"} state={{
          destination: destination, 
          checkIn: checkIn, 
          checkOut: checkOut, 
          guests: guests
        }}>
          <Button variant="danger" size="lg" style={{borderRadius: '25px'}}><i className="fa-solid fa-magnifying-glass"></i></Button>
        </Link>
        </Nav>    
            <Nav className="me-auto">
            {(account) ?
             <Button  variant="light" size="lg" disabled style={{borderRadius: '15px'}}>{account.slice(0,5).concat('...').concat(account.slice(-4))}</Button> :
            <Button variant="light" size="lg" onClick={connect} style={{borderRadius: '15px'}}>Connect Wallet</Button>
            }
            </Nav>
            </Navbar.Collapse>           
        </Navbar>
      )
}

export default NavBar;