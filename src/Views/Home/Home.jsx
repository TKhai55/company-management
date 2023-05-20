

import React from "react";
import Header from "../components/Header/Header";
import SideMenu from "../components/SideMenu/SideMenu";
import "./Home.css";
import { Button, Carousel } from "antd";
import quote1 from '../../images/quote1.jpg'
import quote2 from '../../images/quote2.jpg'
import quote3 from '../../images/quote3.jpg'
import quote4 from '../../images/quote4.jpg'

const Test = () => {

  return (
    <div className="App-container">
      <Header />
      <div className="App-Content-container">
        <SideMenu />
        <div className="App-Content-Main">
          <div className="Home-container">
            <div className="Home-content">
                <div className="carousel-blur"></div> 
                  <Carousel className="carousel-main" autoplay>
                    <div className="img-container">
                      <img src={quote1} alt="Image 1" className="img-slider" />
                    </div>
                    <div className="img-container">
                      <img src={quote2} alt="Image 1" className="img-slider" />
                    </div>
                    <div className="img-container">
                      <img src={quote3} alt="Image 1" className="img-slider" />  
                    </div>
                    <div className="img-container">
                      <img src={quote4} alt="Image 1" className="img-slider" />
                    </div>
                  </Carousel>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
