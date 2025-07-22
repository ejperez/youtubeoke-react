import { useState } from "react";
import Player from "./components/Player";
import Remote from "./components/Remote";

function App() {
  // const [input, setInput] = useState("");
  // const [mirror, setMirror] = useState("");
  const [isPlayer, setIsPlayer] = useState(null);
  const [hasSelectedMode, setHasSelectedMode] = useState(false);

  // useEffect(() => {
  //   socket.on("sync-event", (data) => {
  //     setMirror(data);
  //   });

  //   return () => {
  //     socket.off("sync-event");
  //   };
  // }, []);

  // const handleChange = (e) => {
  //   const value = e.target.value;
  //   setInput(value);
  //   socket.emit("sync-event", value);
  // };

  const playerClickHandler = () => {
    setIsPlayer(true);
    setHasSelectedMode(true);
  };
  const remoteClickHandler = () => {
    setIsPlayer(false);
    setHasSelectedMode(true);
  };

  return hasSelectedMode ? (
    isPlayer ? (
      <Player />
    ) : (
      <Remote />
    )
  ) : (
    <div className="absolute bg-sky-100 h-full w-full">
      <div className="flex gap-2 justify-center">
        <button className="main-button" type="button" onClick={playerClickHandler}>
          Player
        </button>
        <button className="main-button" type="button" onClick={remoteClickHandler}>
          Remote
        </button>
      </div>
    </div>
  );
}

export default App;
