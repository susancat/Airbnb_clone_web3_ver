import React from "react";
import "./Rentals.css";
import { Link } from "react-router-dom";
import { useState,useEffect } from 'react';
import { useLocation } from 'react-router';
import logo from '../images/airbnbRed.png';
import {Button, Row, Col, InputGroup } from "react-bootstrap";
import {rentalsList} from '../sampleRentalsList';
import RentalsMap from "../components/RentalsMap";
import SuccessToast from "../components/SuccessToast";
import ErrorToast from "../components/ErrorToast";
// import User from '../components/User';

import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import abi from '../abi.json';

const Rentals = () => {
  //state contains 4 conditions passed from home page
  const { state: searchFilters } = useLocation();
  const [highlight, setHighLight] = useState();
  const [result, setResult] = useState([]);
  const [coOrdinates, setCoOrdinates] = useState([]);//lat and long
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState();

  const contractAddress = '0x9c976cd69e4E914bECf7aED5618680Db090b0264';

  //each time search conditions changed, fetch the rental list
//search according to city name and smaller than guests limitation
useEffect(() => {
  searchRentals();
}, [searchFilters]);

useEffect(() => {
  (async () => {
     if(localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")) 
     {
       await connectPrompt();
      }
  })()
}, [])

const handleSuccess = () => setSuccess(true);
function handleError(error) {
  setError(true);
  setErrMsg(error);
}
  async function getWeb3Modal() {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
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
async function connectPrompt() {
    const web3Modal = await getWeb3Modal();
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const account = await web3.eth.getAccounts().then(data=>data[0]);
    setAccount(account);
    const mintpassContract = await new web3.eth.Contract(abi, contractAddress);
    setContract(mintpassContract);
}

async function switchNetwork() {
  try {
    // check if the chain to connect to is installed
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: Web3.utils.toHex(80001) }], // chainId must be in hexadecimal numbers
    });
  } catch (error) {
    // This error code indicates that the chain has not been added to MetaMask
    // if it is not, then install it into the user MetaMask
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '80001',
              rpcUrl: 'https://matic-mumbai.chainstacklabs.com',
            },
          ],
        });
      } catch (addError) {
        console.error(addError);
      }
    }
    console.error(error);
  }
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

  async function searchRentals() {
    rentalsList.map(room => {
      if(room.attributes.city === searchFilters.destination && room.attributes.maxGuests >= searchFilters.guests ) {
        const newResult = [...result, room]//this is a non side-effect alternative way for push
        return setResult(newResult);
      }
  });

    let cords = [];
    result.forEach((e) => {
      cords.push({ lat: e.attributes.lat, lng: e.attributes.long });
    });
    setCoOrdinates(cords);
  }
  //call 
  const bookRental = async function(start, end, id, dayPrice) {
    const web3Modal = await getWeb3Modal();
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    await switchNetwork();
    //when start smaller than end date, add one day to the array
    for(
      var arr = [], date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      arr.push(new Date(date).toISOString().slice(0,10));//get a yyyy-mm-dd format
    }
// console.log(dayPrice * arr.length + typeof(dayPrice * arr.length))
    let options = {
      value: web3.utils.toWei((dayPrice * arr.length).toString(), 'ether'),
      from: account
    }
    //https://web3js.readthedocs.io/en/v1.7.4/web3-eth-contract.html#id35
    //need to check what returns in callback function
    await contract.methods.addDatesBooked(id, arr).send(options, function(error, transactionHash){
      if(transactionHash) {
        handleSuccess();
      } else {
        handleError(error);
      }
    });
  }

  return (
    <>
      <Row className="mt-3 ms-3">
        <Col xs={4}>
          <Link to="/">
            <img src={logo} alt="logo" className="logo" style={{width: "55%", height:"65%"}} />
          </Link>
        </Col>
        <Col xs={4}>
          <InputGroup size="lg" className="mt-1">
            <InputGroup.Text>{searchFilters.destination}</InputGroup.Text>
            <InputGroup.Text>
            {`
                ${searchFilters.checkIn.toLocaleString("default", { month: "short", })}
                ${searchFilters.checkIn.toLocaleString("default", { day: "2-digit", })}
                - 
                ${searchFilters.checkOut.toLocaleString("default", { month: "short", })}
                ${searchFilters.checkOut.toLocaleString("default", { day: "2-digit", })}
            `}
            </InputGroup.Text>
            <InputGroup.Text>{searchFilters.guests} Guest</InputGroup.Text>
            <Button variant="danger"><i className="fa-solid fa-magnifying-glass"></i></Button>
          </InputGroup>
        </Col>
        <Col xs={4}>
          <div className="ms-5 mt-1">
          {(account) ?
            <Button variant="secondary" size="lg" disabled><span style={{fontWeight:"600"}}>{account.slice(0,5).concat('...').concat(account.slice(-4))}</span></Button> :
            <Button variant="secondary" onClick={connect}>Connect</Button>
          }
          </div>
        </Col>
      </Row>
      <Row className="ms-2 me-2">
        <Col xs={6} style={{height:'85vh', overflowY: 'scroll'}}>
          <Row>
            <h5 className="ms-2 mt-1">Stay Available For Your Destination</h5>
            <SuccessToast setSuccess={setSuccess} success={success} location={searchFilters.destination} />
            <ErrorToast setError={setError} error={error} msg={errMsg} />
          </Row>
           
            {result &&
              result.map((e, i)=> {
                return (
                  <>
                  <hr />
                  <div className={highlight === i ? "rentalDivH" : "rentalDiv"} key={i}>
                    <img className="rentalImg" src={e.attributes.imgUrl} alt="bnb" />
                    <div className="rentalInfo">
                      <div className="rentalTitle">{e.attributes.name}</div>
                      <div className="rentalDesc">
                        {e.attributes.unoDes}
                      </div>
                      <div className="rentalDesc">
                        {e.attributes.dosDes}
                      </div>
                      <div class="bottomButton">
                        <Button 
                        variant="secondary"
                          onClick={() => {
                            if(account) {
                              bookRental(
                                searchFilters.checkIn,
                                searchFilters.checkOut,
                                Number(e.attributes.id),//the id is the the element index in mapping rentals
                                Number(e.attributes.pricePerDay)//make sure the price is Number
                              )} else {
                                // handleNoAccount()
                                console.log("not work")
                              }
                          }}
                          >Stay here</Button>
                        <div className="price">
                          <span style={{marginTop: '.1rem'}}><i className="fa-brands fa-ethereum"></i></span>{e.attributes.pricePerDay} / Day                          
                        </div>
                      </div>
                    </div>
                  </div>
                  </>
                  )
              })
            }
          </Col>
          <Col xs={6}>
            <RentalsMap locations={coOrdinates} setHighLight={setHighLight} />
          </Col>
      </Row>
    </>
  );
};

export default Rentals;
