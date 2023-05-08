import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./Views/Login/Login";
import JitsiMeet from "./Views/JitsiMeet";
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
        <Routes>
        <Route path="/" element={<Test/>} />
        <Route path="/test2" element={<Test/>} />
        <Route path="/test3" element={<Test/>} />
        <Route path="/test4" element={<div>test4</div>} />
        <Route path="/test5" element={<div>test5</div>} />
        <Route path="/video" element={<JitsiMeet/>} />
      </Routes>
  );
}

export default App;
