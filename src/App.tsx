import "typeface-nunito";
import "typeface-league-spartan";
import "./App.css";
import Home from "./Home";
import Game from "./Game";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/game/:role/:roomid", element: <Game /> },
]);

function App() {
  // List of 25 random words
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
