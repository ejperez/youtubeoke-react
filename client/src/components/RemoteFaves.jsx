import { useLoaderData, useParams } from "react-router";
import { getFavorites, removeFromFavorites } from "../util/faves";
import ListItem from "./ListItem";
import { useState } from "react";
import ModalMenu from "./ModalMenu";
import { playVideo } from "../util/yt";
import { addToQueue } from "../util/yt";

export default function RemoteFaves() {
  const faves = useLoaderData();
  const { playerID } = useParams();

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentFaves, setCurrentFaves] = useState(faves);

  const modalCancelHandler = (e) => {
    e.stopPropagation();
    setSelectedVideo(null);
  };

  const menuOptions = [
    {
      label: "Play",
      action: (e) => {
        e.stopPropagation();

        playVideo(playerID, selectedVideo);
        setSelectedVideo(null);
      },
    },
    {
      label: "Add to queue",
      action: (e) => {
        e.stopPropagation();

        addToQueue(playerID, selectedVideo);
        setSelectedVideo(null);
      },
    },
    {
      label: "Remove from favorites",
      action: async (e) => {
        e.stopPropagation();

        const faves = await removeFromFavorites(selectedVideo.id);

        setCurrentFaves(faves);
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

      <div className="px-4">
        <div className="pb-2 text-sm font-bold">YOUR FAVORITES</div>
        <ul className="flex flex-col gap-2">
          {currentFaves.length > 0 ? (
            currentFaves.map((item) => (
              <ListItem
                key={item.id}
                clickHandler={listClickHandler}
                item={item}
                isActive={item.id === selectedVideo?.id}
              />
            ))
          ) : (
            <div className="italic">No favorites added yet</div>
          )}
        </ul>
      </div>
    </>
  );
}

export async function loader({ request }) {
  return await getFavorites();
}
