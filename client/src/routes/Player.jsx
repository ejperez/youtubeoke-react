import { useEffect, useState, useMemo } from "react";
import { generateCode } from "../util/util";
import { getSocket } from "../util/socket";
import PlayerFrame from "../components/PlayerFrame";
import PlayerHome from "../components/PlayerHome";
import { QRCode } from "react-qr-code";
import { Link } from "react-router";

export default function Player() {
  const id = useMemo(generateCode, []);
  const socket = getSocket();
  const [videoID, setVideoID] = useState(null);
  const [queue, setQueue] = useState([]);
  const remoteLink = `${document.location.href}${id}/remote`;

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

  return (
    <div className="absolute inset-0">
      {videoID ? (
        <PlayerFrame videoID={videoID} />
      ) : (
        <PlayerHome playerID={id} />
      )}
      <div className="font-heading text-lg absolute top-0 w-full flex justify-between p-1 z-50 bg-black/75">
        <div className="grow flex w-full">Current song: Nothing</div>
        <div className="grow flex w-full">Next song: Nothing</div>
        <div className="w-72 text-right">In queue: {queue.length}</div>
      </div>

      {videoID && (
        <div className="absolute bottom-0 z-50 opacity-5 hover:opacity-100 w-full p-1">
          <QRCode
            className="p-1 rounded-xl bg-white size-52"
            value={remoteLink}
          />
        </div>
      )}
    </div>
  );
}
