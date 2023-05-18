
import React from "react";
import Header from "../components/Header/Header";
import SideMenu from "../components/SideMenu/SideMenu";
import "./News.css";


const News = () => {
  return (
    <div className="App-container">
      <Header />
      <div className="App-Content-container">
        <SideMenu/>
        <div className="App-Content-Main">
          <div>
            News
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
