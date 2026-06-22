import { useEffect, useState, useMemo, useRef } from "react";
import { generateCode } from "../util/util";
import { getSocket } from "../util/socket";
import PlayerFrame from "../components/PlayerFrame";
import PlayerHome from "../components/PlayerHome";
import { QRCode } from "react-qr-code";
import { Link } from "react-router";

export default function Player() {
  const id = "12345"; //TODO: useMemo(generateCode, []);
  const socket = getSocket();
  const [currentVideo, setCurrentVideo] = useState(null);
  const [queue, setQueue] = useState([]);
  const remoteLink = `${document.location.href}${id}/remote`;
  const queueRef = useRef(queue);
  const currentVideoRef = useRef(currentVideo);

  useEffect(() => {
    queueRef.current = queue;
    currentVideoRef.current = currentVideo;
  }, [queue, currentVideo]);

  const playNextInQueue = () => {
    if (queue.length > 0) {
      setCurrentVideo(queue[0]);
      setQueue((queue) => queue.slice(1));
    } else {
      setCurrentVideo(null);
    }
  };

  const broadcastQueue = () => {
    socket.emit("sync-event", {
      action: "current-queue",
      payload: {
        playerID: id,
        queue: queueRef.current,
        currentVideo: currentVideoRef.current,
      },
    });
  };

  // Autoplay first item in queue if nothing is playing
  useEffect(() => {
    if (!currentVideo) {
      playNextInQueue();
    }
  }, [queue, currentVideo]);

  useEffect(() => {
    broadcastQueue();
  }, [queue, currentVideo]);

  useEffect(() => {
    socket.on("sync-event", (data) => {
      if (id !== data.payload.playerID) {
        return;
      }

      console.log(data);

      switch (data.action) {
        case "play-item":
          setCurrentVideo(data.payload.video);

          break;
        case "add-to-queue":
          setQueue((queue) => [...queue, data.payload.video]);

          break;
        case "get-queue":
          broadcastQueue();

          break;
        case "remove-from-queue":
          setQueue((queue) =>
            queue.filter((item) => item.id !== data.payload.video.id),
          );

          break;
      }
    });

    return () => {
      socket.off("sync-event");
    };
  }, []);

  return (
    <div className="absolute inset-0">
      {currentVideo ? (
        <PlayerFrame
          videoID={currentVideo.id}
          onEnd={playNextInQueue}
          onError={playNextInQueue}
        />
      ) : (
        <PlayerHome playerID={id} />
      )}
      <div className="font-heading text-lg absolute top-0 w-full flex justify-between p-1 z-50 bg-black/75">
        <div className="grow flex w-full truncate">
          <span className="text-green-500 pr-1">Current song:</span>
          {currentVideo?.title || "Nothing"}
        </div>
        <div className="grow flex w-full pl-2 truncate">
          <span className="text-yellow-500 pr-1">Next song:</span>
          {queue[0]?.title || "Nothing"}
        </div>
        <div className="w-72 text-right">
          <span className="text-red-500 pr-1">In queue:</span>
          {queue.length}
        </div>
      </div>

      {currentVideo && (
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
