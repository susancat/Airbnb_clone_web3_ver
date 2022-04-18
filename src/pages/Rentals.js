import React from "react";
import "./Rentals.css";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router';
import logo from '../images/airbnbRed.png';
import { ConnectButton, Icon, Button } from "web3uikit";
import {rentalsList} from '../sampleRentalsList';

const Rentals = () => {
  const { state: searchFilters } = useLocation();
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
              rentalsList.map(e => {
                return (
                  <>
                  <hr className="line2" />
                  <div className="rentalDiv">
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
                            svg="matic"
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
          <div className="rentalsContentR"></div>
        </div>
      </div>
    </>
  );
};

export default Rentals;
