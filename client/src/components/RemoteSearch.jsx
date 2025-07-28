import { useEffect, useState } from "react";
import { search, getNextPage } from "../util/yt";
import { useLoaderData, useParams } from "react-router";
import { SpinnerIcon } from "./Loader";
import Modal from "./Modal";
import ListItem from "./ListItem";
import { getSocket } from "../util/socket";

export default function RemoteSearch() {
  const [page, setPage] = useState(1);
  const { items, hasNextPage } = useLoaderData();
  const [currentItems, setCurrentItems] = useState(items);
  const [currentHasNextPage, setCurrentHasNextPage] = useState(hasNextPage);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const socket = getSocket();
  const { playerID } = useParams();

  useEffect(() => {
    if (page === 1) {
      return;
    }

    async function fetchData() {
      const { items, hasNextPage } = await getNextPage();

      setCurrentItems((currentItems) => {
        return [...currentItems, ...items];
      });
      setCurrentHasNextPage(hasNextPage);
      setIsLoading(false);
    }

    setIsLoading(true);
    fetchData();
  }, [page]);

  const modalPlayHandler = (e) => {
    e.stopPropagation();

    socket.emit("sync-event", {
      action: "play-item",
      payload: {
        playerID: playerID,
        videoID: selectedVideo,
      },
    });

    setSelectedVideo(null);
  };

  const listClickHandler = (id) => {
    setSelectedVideo(id);
  };

  const modalCancelHandler = (e) => {
    e.stopPropagation();
    setSelectedVideo(null);
  };

  const modalAddToFavesHandler = (e) => {
    e.stopPropagation();
    setSelectedVideo(null);
  };

  const menuOptions = [
    {
      label: "Play",
      action: modalPlayHandler,
    },
    {
      label: "Add to favorites",
      action: modalAddToFavesHandler,
    },
    { label: "Cancel", action: modalCancelHandler },
  ];

  return (
    <>
      {selectedVideo && (
        <Modal closeHandler={modalCancelHandler}>
          {menuOptions.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="bg-white text-black px-4 py-2 rounded-full leading-10"
            >
              {item.label}
            </button>
          ))}
        </Modal>
      )}

      <div className="p-2 pt-16">
        {currentItems.length === 0 ? (
          <p>No results.</p>
        ) : (
          <>
            <ul className="flex flex-col gap-2">
              {currentItems
                .filter(
                  (obj, index, self) =>
                    index === self.findIndex((o) => o.id === obj.id)
                )
                .map((item) => (
                  <li
                    key={item.id + item.image}
                    style={{ backgroundImage: `url(${item.image})` }}
                    className="bg-cover relative rounded-2xl"
                  >
                    <ListItem clickHandler={listClickHandler} item={item} />
                  </li>
                ))}
            </ul>

            {currentHasNextPage && (
              <button
                className="w-full p-2 bg-white/25 mt-2 rounded-2xl"
                type="button"
                onClick={() => setPage((page) => page + 1)}
                disabled={isLoading}
              >
                {isLoading ? <SpinnerIcon inline={true} /> : "Load more"}
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
}

export async function loader({ request }) {
  const [, searchParams] = request.url.split("?");
  const keyword = new URLSearchParams(searchParams).get("keyword");

  return await search(keyword);
}
