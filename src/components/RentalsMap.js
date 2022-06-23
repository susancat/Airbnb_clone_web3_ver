import React from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import { useState, useEffect } from 'react';

function RentalsMap({ locations, google, setHighLight }) {
  const [center, setCenter] = useState();
  useEffect(() => {
    const arr = Object.keys(locations);
    const getLat = (key) => locations[key]["lat"];
    const avgLat = arr.reduce((a,c) => a + Number(getLat(c)), 0) / arr.length;
    const getLng = (key) => locations[key]["lng"];
    const avgLng = arr.reduce((a,c) => a + Number(getLng(c)), 0) / arr.length;

    setCenter({ lat: avgLat, lng: avgLng});
  }, [locations])
  return (
    <>
      { center && (
        <Map
        google={google}
        containerStyle={{
          width: "50vw",
          height: "calc(100vh - 135px)"
        }}
        center={center}
        initialCenter={locations[0]}
        zoom={13}
        disableDefaultUI={true}
        >
          {locations.map((coords, i) => (
            <Marker position={coords} key={i} onClick={() => setHighLight(i)} />
          ))}
        </Map>
      )

      
      }
    </>
  );
}

export default GoogleApiWrapper({
  apiKey:""
})(RentalsMap);
