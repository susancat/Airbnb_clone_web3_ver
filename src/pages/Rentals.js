import React from "react";
import "./Rentals.css";
import { Link } from "react-router-dom";
import { useState,useEffect } from 'react';
import { useLocation } from 'react-router';
import logo from '../images/airbnbRed.png';
import { ConnectButton, Icon, Button } from "web3uikit";
// import {rentalsList} from '../sampleRentalsList';
import RentalsMap from "../components/RentalsMap";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";

const Rentals = () => {
  const { state: searchFilters } = useLocation();
  const [highlight, setHighLight] = useState();
  const [rentalsList, setRentalsList] = useState();
  const [coOrdinates, setCoOrdinates] = useState([]);//lat and long
  const contractProcessor = useWeb3ExecuteFunction();

  const { Moralis } = useMoralis();
//each time search conditions changed, fetch the rental list
//search according to city name and smaller than guests limitation
  useEffect(() => {
    async function fetchRentalsList() {
    const Rentals = Moralis.Object.extend("Rentals");
    const query = new Moralis.Query(Rentals);
    query.equalTo("city", searchFilters.destination);
    query.greaterThanOrEqualTo("maxGuests_decimal", searchFilters.guests);

    const result = await query.find();
    let cords = [];
    result.map(e => {
      cords.push({ lat: e.attributes.lat, lng: e.attributes.long });
    });
    setCoOrdinates(cords);
    setRentalsList(result);
    }
    fetchRentalsList();
  }, [searchFilters]);

  const bookRental = async function(start, end, id, dayPrice) {
    for(
      var arr = [], dt = new Date(start);
      dt <= end;
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt).toISOString().slice(0,10));//get a yyyy-mm-dd format
    }

    let options = {
      contractAddress: "0x9F73C6eAEbA5417317730Fc4e5A6e810A91BC0bd",
      functionName: "addDatesBooked",
      abi: [
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string[]",
              "name": "newBookings",
              "type": "string[]"
            }
          ],
          "name": "addDatesBooked",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        }
      ],
      params: {
        id: id,
        newBookings: arr,
      },
      msgValue: Moralis.Units.ETH(dayPrice * arr.length),
    }
    await contractProcessor.fetch({
      params: options//1:13:01


      
    })
  }

  return (
    <>
      <div className="topBanner">
        <div>
          <Link to="/">
            <img src={logo} alt="logo" className="logo"/>
          </Link>
        </div>
        <div className="searchReminder">
          <div className="filter">{searchFilters.destination}</div>
          <div className="vl" />
          <div className="filter">
            {`
                ${searchFilters.checkIn.toLocaleString("default", { month: "short", })}
                ${searchFilters.checkIn.toLocaleString("default", { day: "2-digit", })}
                - 
                ${searchFilters.checkOut.toLocaleString("default", { month: "short", })}
                ${searchFilters.checkOut.toLocaleString("default", { day: "2-digit", })}
            `}
          </div>
          <div className="vl" />
          <div className="filter">{searchFilters.guests} Guest</div>
          <div className="searchButton">
              <Icon fill="#fff" size={24} svg='search' />
          </div>
        </div>
        <div className="lrContainers">
          <ConnectButton />
        </div>
      </div>
      <div className="line">
        <div className="rentalsContent">
          <div className="rentalsContentL">
            Stay Available For Your Destination
            {rentalsList &&
              rentalsList.map((e, i)=> {
                return (
                  <>
                  <hr className="line2" />
                  <div className={highlight === i ? "rentalDivH" : "rentalDiv"}>
                    <img className="rentalImg" src={e.attributes.imgUrl} />
                    <div className="rentalInfo">
                      <div className="rentalTitle">{e.attributes.name}</div>
                      <div className="rentalDesc">
                        {e.attributes.unoDescription}
                      </div>
                      <div className="rentalDesc">
                        {e.attributes.dosDescription}
                      </div>
                      <div class="bottomButton">
                        <Button text="Stay here" />
                        <div class="price">
                          <Icon 
                            fill="#808080"
                            size={10}
                            svg="eth"
                            />
                              {e.attributes.pricePerDay} / Day                          
                        </div>
                      </div>
                    </div>
                  </div>
                  </>
                  )
              })
            }
          </div>
          <div className="rentalsContentR">
            <RentalsMap locations={coOrdinates} setHighLight={setHighLight} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Rentals;
