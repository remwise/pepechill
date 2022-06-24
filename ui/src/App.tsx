import React, { useEffect, useState } from "react";
// @ts-ignore
import logo from "./logo.svg";
import axios from "axios";
import "./App.css";
import io from "socket.io-client";

const API_URL = `http://localhost:3001`;

const socket = io(API_URL);

const App = () => {
  useEffect(() => {
    // socket.emit("send data", { data: "tmp" });
    axios.post(`${API_URL}/user`, { username: "tmp2" });
  }, []);

  return (
    <div className="App">
      <video autoPlay={true} id="vid" style={{ display: "none" }}></video>
      <canvas
        id="canvas"
        width="640"
        height="480"
        style={{ border: "1px solid #d3d3d3" }}
      ></canvas>
      <br></br>
    </div>
  );
};

export default App;
