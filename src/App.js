import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./Views/Login/Login";
import JitsiMeet from "./Views/JitsiMeet";
import Header from "./Views/components/Header/Header";
import SideMenu from "./Views/components/SideMenu/SideMenu";
import { Layout } from "antd";
import Test from "./Views/components/Test";



const islogin = true;

function App() {
  if(islogin === false) return(
    <Routes>
      <Route path="/signin" element={<Login/>} />
    </Routes>
  ) 
  else 
  return (
    
    <div className="App-container">
      <Header/>
      <div className="App-Content-container">
        <SideMenu/>
        <div className="App-Content-Main">
          <Content/>
        </div>
      </div>
    </div>
  );
}

function Content(){
  return(
    
      <Routes>
        <Route path="/" element={<div style={{height: '200%'}}>test1</div>} />
        <Route path="/test2" element={<Test/>} />
        <Route path="/test3" element={<div>test3</div>} />
        <Route path="/test4" element={<div>test4</div>} />
        <Route path="/test5" element={<div>test5</div>} />
      </Routes>
    
  )
}

export default App;
