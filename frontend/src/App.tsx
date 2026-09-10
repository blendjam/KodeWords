import "typeface-nunito/index.css";
import "typeface-league-spartan/index.css";
import "./App.css";
import Home from "./Home";
import { useEffect } from "react";
import { useWs } from "./hooks/wsContext";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const userId = "sanket123";
  const { room } = useWs();
  useEffect(() => {
    if (!room || !room.players) return;
    const player = room.players.get(userId);
    if (player) {
      const params = new URLSearchParams({
        id: room.roomId,
        list: room.listType,
        role: player.role,
      });
      navigate(`/game?${params.toString()}`);
    }
  }, [room]);
  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;
