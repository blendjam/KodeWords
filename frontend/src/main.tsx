import ReactDOM from "react-dom/client";
import "./main.css";
import App from "./App";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Game from "./Game";
import AssetLoader from "./AssetLoader";
import { WsProvider } from "./hooks/wsProvider";

const router = createHashRouter([
  {
    path: "/",
    element: <AssetLoader />,
    children: [
      { path: "/", element: <App /> },
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
    <WsProvider>
      <RouterProvider router={router}></RouterProvider>
    </WsProvider>,
  );
} else {
  console.error("Root element not found");
}
