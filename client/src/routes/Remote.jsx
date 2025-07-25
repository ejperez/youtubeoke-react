import { useParams } from "react-router";
import { getSocket } from "../util/socket";
import { Outlet } from "react-router";
import { Form } from "react-router";
import Loader from "../components/Loader";

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

  return (
    <>
      <Form
        action={`/${playerID}/remote/search`}
        method="get"
        className="fixed w-full p-2 z-3"
      >
        <input
          className="w-full bg-white p-3 rounded-full border-1"
          name="keyword"
          type="text"
          placeholder="Search YouTube"
        />
      </Form>

      <Loader>
        <Outlet onPlay={playHandler} />
      </Loader>
    </>
  );
}
