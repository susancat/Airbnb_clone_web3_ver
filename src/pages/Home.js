import React from "react";
import "./Home.css";
import bg from '../images/frontpagebg2.png';
import NavBar from '../components/Nav';
import { Container, Button } from "react-bootstrap";
const Home = () => {
  return (
      <div className="bg" style={{ backgroundImage: `url(${bg})`}}>
        <Container>
      <NavBar style={{backgroundImage: 'rgba(255,255,255,.1)'}} /> 
        <div className="title">Feel Adventurous</div>
        <div className="text">
          <h3>Let us decide and discover new places </h3>
          <h3>to stay, live, work or just relax.</h3>
        </div>
        <Button 
        size="lg"
        variant="light"
        style={{borderRadius: '15px'}}
        onClick={() => console.log("clicked")}>Explore a Location</Button>
        </Container>
    </div>
  );
};

export default Home;
