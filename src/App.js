import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./Views/Login/Login";
import JitsiMeet from "./Views/JitsiMeet";
import Header from "./Views/components/Header/Header";
import SideMenu from "./Views/components/SideMenu/SideMenu.tsx";
import { Layout } from "antd";
import Test from "./Views/components/Test";


function App() {
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
    // <Layout>
    //   <Layout.Sider >
    //     <SideMenu/>
    //   </Layout.Sider>
    //   <Layout.Content>
    //     <Content/>
    //   </Layout.Content>
    // </Layout>
  );
}

function Content(){
  return(
    
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/test1" element={<div style={{height: '200%'}}>test1</div>} />
        <Route path="/test2" element={<Test/>} />
        <Route path="/test3" element={<div>test3</div>} />
        <Route path="/test4" element={<div>test4</div>} />
        <Route path="/test5" element={<div>test5</div>} />
        {/* <Route path="/video" element={<JitsiMeet />}></Route> */}
      </Routes>
    
  )
}

export default App;
