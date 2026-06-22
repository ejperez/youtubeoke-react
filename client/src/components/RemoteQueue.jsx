import { useLoaderData, useParams } from "react-router";
import ListItem from "./ListItem";
import { useState, useEffect } from "react";
import ModalMenu from "./ModalMenu";
import { playVideo } from "../util/yt";
import { addToFavorites } from "../util/faves";
import { getSocket } from "../util/socket";
import { getQueue, removeFromQueue } from "../util/yt";

export default function RemoteQueue() {
  const { playerID } = useParams();
  const socket = getSocket();

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentQueue, setCurrentQueue] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);

  const modalCancelHandler = (e) => {
    e.stopPropagation();
    setSelectedVideo(null);
  };

  useEffect(() => {
    socket.on("sync-event", (data) => {
      if (String(playerID) !== data.payload.playerID) {
        return;
      }

      switch (data.action) {
        case "current-queue":
          setCurrentQueue(data.payload.queue);
          setCurrentVideo(data.payload.currentVideo);

          break;
      }
    });

    socket.emit("sync-event", {
      action: "get-queue",
      payload: {
        playerID: playerID,
      },
    });

    return () => {
      socket.off("sync-event");
    };
  }, []);

  const menuOptions = [
    {
      label: "Play",
      action: (e) => {
        e.stopPropagation();
        playVideo(playerID, selectedVideo);
        removeFromQueue(playerID, selectedVideo);
        setSelectedVideo(null);
      },
    },
    {
      label: "Add to favorites",
      action: async (e) => {
        e.stopPropagation();
        await addToFavorites(selectedVideo);
        setSelectedVideo(null);
      },
    },
    {
      label: "Remove from queue",
      action: (e) => {
        e.stopPropagation();
        removeFromQueue(playerID, selectedVideo);
        setSelectedVideo(null);
      },
    },
    {
      label: "Cancel",
      action: modalCancelHandler,
    },
  ];

  const listClickHandler = (item) => {
    setSelectedVideo(item);
  };

  return (
    <>
      {selectedVideo && (
        <ModalMenu
          modalCancelHandler={modalCancelHandler}
          menuOptions={menuOptions}
        />
      )}

      <div className="pr-2 pl-2">
        <div className="text-center pb-2 text-2xl">Now playing</div>
        <ul className="flex flex-col gap-2">
          {currentVideo ? (
            [currentVideo].map((item) => <ListItem key={item.id} item={item} />)
          ) : (
            <div className="text-center pb-2">Nothing</div>
          )}
        </ul>
        <div className="text-center py-2">In queue</div>
        <ul className="flex flex-col gap-2">
          {currentQueue && currentQueue.length > 0 ? (
            currentQueue.map((item) => (
              <ListItem
                key={item.id}
                clickHandler={listClickHandler}
                item={item}
                isActive={item.id === selectedVideo?.id}
              />
            ))
          ) : (
            <div className="text-center pb-2">Nothing</div>
          )}
        </ul>
      </div>
    </>
  );
}
