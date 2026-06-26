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
import List from "./List";
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

  return (
    <div className="px-4">
      {currentItems.length === 0 ? (
        <div className="pb-2 text-sm font-bold">NO RESULTS</div>
      ) : (
        <>
          <div className="pb-2 text-sm font-bold">SEARCH RESULTS</div>

          <List
            items={currentItems.filter(
              (obj, index, self) =>
                index === self.findIndex((o) => o.id === obj.id),
            )}
            selectedItem={selectedVideo}
            menuOptions={menuOptions}
            onSelect={listClickHandler}
          />

          {currentHasNextPage && (
            <button
              className="w-full p-2 bg-white/50 my-2 rounded-2xl"
              type="button"
              onClick={loadMoreHandler}
              disabled={isLoading}
            >
              {isLoading ? <SpinnerIcon inline={true} /> : "Load more"}
            </button>
          )}

          {error && <ErrorComponent className="mt-2" message={error} />}
        </>
      )}
    </div>
  );
}

export async function loader({ request }) {
  const [, searchParams] = request.url.split("?");
  const keyword = new URLSearchParams(searchParams).get("keyword");

  return await search(keyword + " karaoke");
}
