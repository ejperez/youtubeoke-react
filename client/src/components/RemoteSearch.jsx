import { useState } from "react";
import { search, getNextPage, playVideo } from "../util/yt";
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

export default function RemoteSearch() {
  const { items, hasNextPage } = useLoaderData();
  const { playerID } = useParams();

  const navigate = useNavigate();
  const { clearKeyword } = useOutletContext();

  const [currentItems, setCurrentItems] = useState(items);
  const [currentHasNextPage, setCurrentHasNextPage] = useState(hasNextPage);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const loadMoreHandler = async () => {
    setIsLoading(true);

    const { items, hasNextPage } = await getNextPage();

    setCurrentItems((currentItems) => {
      return [...currentItems, ...items];
    });
    setCurrentHasNextPage(hasNextPage);
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

      <div className="px-2 pb-2">
        {currentItems.length === 0 ? (
          <p>No results.</p>
        ) : (
          <>
            <div className="text-center pb-2">Search results</div>

            <ul className="flex flex-col gap-2">
              {currentItems
                .filter(
                  (obj, index, self) =>
                    index === self.findIndex((o) => o.id === obj.id)
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

  return await search(keyword);
}
