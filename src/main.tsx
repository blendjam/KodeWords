import ReactDOM from "react-dom/client";
import "./main.css";
import App from "./App";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Game from "./Game";
import AssetLoader from "./AssetLoader";

const router = createHashRouter([
  {
    path: "/",
    element: <AssetLoader />,
    children: [
      { path: "/", element: <App /> },
      { path: "/game/:listname/:roomid/:role", element: <Game /> },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RouterProvider router={router}></RouterProvider>);
} else {
  console.error("Root element not found");
}
