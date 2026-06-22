import { useState } from "react";
import { search, getNextPage, playVideo, addToQueue } from "../util/yt";
import { addToFavorites } from "../util/faves";
import {
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router";
import { SpinnerIcon } from "./Loader";
import ListItem from "./ListItem";
import ModalMenu from "./ModalMenu";
import ErrorComponent from "./ErrorComponent";

export default function RemoteSearch() {
  const { items, hasNextPage } = useLoaderData();
  const { playerID } = useParams();

  const navigate = useNavigate();
  const { clearKeyword } = useOutletContext();

  const [currentItems, setCurrentItems] = useState(items);
  const [currentHasNextPage, setCurrentHasNextPage] = useState(hasNextPage);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [error, setError] = useState(null);

  const loadMoreHandler = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const { items, hasNextPage } = await getNextPage();

      setCurrentItems((currentItems) => {
        return [...currentItems, ...items];
      });
      setCurrentHasNextPage(hasNextPage);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  };

  const listClickHandler = (item) => {
    setSelectedVideo(item);
  };

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
      label: "Add to favorites",
      action: async (e) => {
        e.stopPropagation();

        await addToFavorites(selectedVideo);

        setSelectedVideo(null);
      },
    },
    {
      label: "Cancel",
      action: modalCancelHandler,
    },
  ];

  const favoritesClickHandler = () => {
    clearKeyword();
    navigate(`/${playerID}/remote`);
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
        {currentItems.length === 0 ? (
          <div className="pb-2 text-sm font-bold">NO RESULTS</div>
        ) : (
          <>
            <div className="pb-2 text-sm font-bold">SEARCH RESULTS</div>

            <ul className="flex flex-col gap-2">
              {currentItems
                .filter(
                  (obj, index, self) =>
                    index === self.findIndex((o) => o.id === obj.id),
                )
                .map((item) => (
                  <ListItem
                    key={item.id}
                    clickHandler={listClickHandler}
                    item={item}
                    isActive={item.id === selectedVideo?.id}
                  />
                ))}
            </ul>

            {currentHasNextPage && (
              <button
                className="w-full p-2 bg-white/25 mt-2 rounded-2xl"
                type="button"
                onClick={loadMoreHandler}
                disabled={isLoading}
              >
                {isLoading ? <SpinnerIcon inline={true} /> : "Load more"}
              </button>
            )}

            {error && <ErrorComponent className="mt-2" message={error} />}

            <button
              type="button"
              className="w-full p-2 bg-white/25 mt-2 rounded-2xl"
              onClick={favoritesClickHandler}
            >
              Back to favorites
            </button>
          </>
        )}
      </div>
    </>
  );
}

export async function loader({ request }) {
  const [, searchParams] = request.url.split("?");
  const keyword = new URLSearchParams(searchParams).get("keyword");

  return await search(keyword + " karaoke");
}
