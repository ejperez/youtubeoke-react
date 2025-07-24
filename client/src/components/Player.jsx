import { useEffect, useState, useMemo } from "react";
import { generateCode } from "../util/util";
import { getSocket } from "../util/socket";
import PlayerFrame from "./PlayerFrame";

export default function Player() {
  const id = useMemo(generateCode, []);
  const socket = getSocket();
  const [videoID, setVideoID] = useState(null);

  useEffect(() => {
    socket.on("sync-event", (data) => {
      console.log(data);

      switch (data.action) {
        case "test-player-id":
          if (id !== data.payload) {
            return;
          }

          socket.emit("sync-event", {
            action: "test-player-id-ok",
            payload: data.payload,
          });
          break;
        case "play-item":
          if (id !== data.payload.playerID) {
            return;
          }

          socket.emit("sync-event", {
            action: "playing-item",
            payload: {
              playerID: data.payload.playerID,
              videoID: data.payload.videoID,
            },
          });

          setVideoID(data.payload.videoID);

          break;
      }
    });

    return () => {
      socket.off("sync-event");
    };
  }, []);

  return (
    <div>      
      <div>
        {videoID ? <PlayerFrame videoID={videoID} /> : <p>Player ID: {id}. Waiting for remote...</p>}
      </div>
    </div>
  );
}
