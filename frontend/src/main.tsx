import ReactDOM from "react-dom/client";
import "./main.css";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Game from "./Game";
import AssetLoader from "./AssetLoader";
import { WsProvider } from "./hooks/wsProvider";
import Home from "./Home";
import App from "./App";

const router = createHashRouter([
  {
    path: "/",
    element: <AssetLoader />,
    children: [
      { path: "/", element: <App /> },
      { path: "/home", element: <Home /> },
      { path: "/game", element: <Game /> },
    ],
  },
]);

if (import.meta.env.DEV && "serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  });
}

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <WsProvider onStart={() => {}}>
      <RouterProvider router={router} />
    </WsProvider>,
  );
} else {
  console.error("Root element not found");
}
