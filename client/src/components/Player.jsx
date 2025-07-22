import { useEffect } from "react";
import { generateCode } from "../util/util";
import { getSocket } from "../util/socket";

export default function Player() {
  const id = generateCode();
  const socket = getSocket();

  useEffect(() => {
    socket.on("sync-event", (data) => {
      console.log(data);

      switch (data.action) {
        case "test-player-id":
          if (id === data.payload) {
            socket.emit("sync-event", {
              action: "test-player-id-ok",
              payload: data.payload,
            });
          }
          break;
      }
    });

    return () => {
      socket.off("sync-event");
    };
  }, []);

  return <div>Player ID {id}</div>;
}
