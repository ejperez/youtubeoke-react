import { useState, useEffect } from "react";
import { getSocket } from "../util/socket";

export default function RemoteLogin({ onSetPlayerID }) {
  const [playerID, setPlayerID] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const socket = getSocket();

  useEffect(() => {
    socket.on("sync-event", (data) => {
      console.log(data);

      switch (data.action) {
        case "test-player-id-ok":
          onSetPlayerID(data.payload);
          break;
      }
    });

    return () => {
      socket.off("sync-event");
    };
  }, []);

  const playerIDChangeHandler = (e) => {
    setPlayerID(e.target.value);
  };

  const playerIDButtonClickHandler = () => {
    if (!playerID) {
      return;
    }

    setIsChecking(true);
    socket.emit("sync-event", {
      action: "test-player-id",
      payload: playerID,
    });
  };

  const cancelCheckClickHandler = () => {
    setIsChecking(false);
  };

  return (
    <div>
      Input Player ID:
      <input type="text" onChange={playerIDChangeHandler} maxLength={5} />
      {isChecking ? (
        <button type="button" onClick={cancelCheckClickHandler}>
          Waiting for player... click to cancel
        </button>
      ) : (
        <button type="button" onClick={playerIDButtonClickHandler}>
          Let's go
        </button>
      )}
    </div>
  );
}
