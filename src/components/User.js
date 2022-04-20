import React from "react";
import { Icon, Modal, Card } from 'web3uikit';
import { useState, useEffect } from 'react';
import{ useMoralis } from 'react-moralis';

function User({account}) {
  const [visible, setVisible] = useState(false);
  const { Moralis } = useMoralis();
  const [userRentals, setUserRentals] = useState();

  useEffect(() => {
    async function fetchRentals() {
      const rentals = Moralis.Object.extend("newBookings");//the name of data collection
      const query = new Moralis.Query(rentals);
      query.equalTo("booker", account);
      const result = await query.find();

      setUserRentals(result);
    }

    fetchRentals()
  },[visible])

  return (
    <>
    <div onClick={() => setVisible(true)}>
      <Icon fill="#000" size={24} svg="user" />
    </div>
      <Modal 
        onCloseButtonPressed={() => setVisible(false)}
        hasFooter={false}
        title="Your Stays"
        isVisible={visible}
      >
        <div style={{display: "flex", justifyContent:"start", flexWrap:"wrap", gap:"1rem"}}>
        {userRentals && 
          userRentals.map(e => {
            return(
              <div style={{width:"15rem"}}>
                <Card
                isDisabled
                title={e.attributes.city}
                description={`${e.attributes.datesBooked[0]} for ${e.attributes.datesBooked.length} Days`}
                >
                  <div>
                    <img width="100%" alt="bnb" src={e.attributes.imgUrl} />
                  </div>
                </Card>
              </div>
            )
          })
        }
        </div>
      </Modal>
    </>
  );
}

export default User;
