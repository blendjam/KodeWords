import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import "./Home.css";

const Home = () => {
  const [roomid, setRoomid] = useState("");
  const navigate = useNavigate();
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomid(event.target.value);
  };

  const onRandomButtonClick = () => {
    const randomRoomid = Math.floor(100 + Math.random() * 9000).toString();
    setRoomid(randomRoomid);
  };
  const onLinkClick = (role: string, event: any) => {
    if (roomid === "") {
      const randomRoomid = Math.floor(100 + Math.random() * 9000).toString();
      setRoomid(randomRoomid);
      event.preventDefault();
      navigate(`/game/${role}/${randomRoomid}`);
    }
  };
  useEffect(() => {
    document.documentElement.style.setProperty("--base", "radial-gradient(circle,#383838 0%, #2f2f2f 100%)");
  }, []);
  return (
    <div className="Home">
      <h1 className="Title">Home</h1>
      <div className="InputContainer">
        <input placeholder="Enter Room ID" onChange={onInputChange} value={roomid} type="number" />
        <button className="Button" onClick={onRandomButtonClick}>
          🎲
        </button>
      </div>
      <div className="ButtonContainer">
        <Link
          to={`/game/spymaster/${roomid}`}
          defaultValue={"spymaster"}
          className="Link"
          onClick={(e: any) => {
            onLinkClick("spymaster", e);
          }}>
          <button className="Button Spymaster">Join as Spymaster</button>
        </Link>
        <Link to={`/game/operative/${roomid}`} className="Link" onClick={(e: any) => onLinkClick("operative", e)}>
          <button className="Button Operative">Join as Operatives</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
