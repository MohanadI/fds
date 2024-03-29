import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import 'antd/dist/antd.min.css';
import "./assets/css/generalStyle.css";
import Main from "./layout/main";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Main />
  </BrowserRouter>
);
