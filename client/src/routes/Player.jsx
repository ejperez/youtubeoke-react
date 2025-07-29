import { useEffect, useState, useMemo } from "react";
import { generateCode } from "../util/util";
import { getSocket } from "../util/socket";
import PlayerFrame from "../components/PlayerFrame";
import PlayerHome from "../components/PlayerHome";

export default function Player() {
  const id = useMemo(generateCode, []);
  const socket = getSocket();
  const [videoID, setVideoID] = useState(null);

  useEffect(() => {
    socket.on("sync-event", (data) => {
      console.log(data);

      switch (data.action) {
        case "play-item":
          if (id !== data.payload.playerID) {
            return;
          }

          socket.emit("sync-event", {
            action: "playing-item",
            payload: {
              playerID: data.payload.playerID,
              videoID: data.payload.video.id,
            },
          });

          setVideoID(data.payload.video.id);

          break;
      }
    });

    return () => {
      socket.off("sync-event");
    };
  }, []);

  return videoID ? (
    <PlayerFrame videoID={videoID} />
  ) : (
    <PlayerHome playerID={id} />
  );
}
