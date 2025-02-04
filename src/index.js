import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createHashRouter, HashRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Game from "./Game";


const router = createHashRouter([
  { path: "/", element: <App /> },
  { path: "/game/:role/:roomid", element: <Game /> },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <RouterProvider router={router} >
  </RouterProvider>
);
