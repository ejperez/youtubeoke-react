import { useParams } from "react-router";
import { getSocket } from "../util/socket";
import RemoteSearch from "../components/RemoteSearch";

export default function Remote() {
  const { playerID } = useParams();
  const socket = getSocket();

  const playHandler = (videoID) => {
    socket.emit("sync-event", {
      action: "play-item",
      payload: {
        playerID: playerID,
        videoID: videoID,
      },
    });
  };

  return <RemoteSearch onPlay={playHandler} />;
}
