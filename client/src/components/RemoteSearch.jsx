import { useEffect, useState } from "react";
import { search, getNextPage } from "../util/yt";
import { useLoaderData } from "react-router";
import { SpinnerIcon } from "./Loader";

export default function RemoteSearch({ onPlay, onFavorite }) {
  const [page, setPage] = useState(1);
  const { items, hasNextPage } = useLoaderData();
  const [currentItems, setCurrentItems] = useState(items);
  const [currentHasNextPage, setCurrentHasNextPage] = useState(hasNextPage);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
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
                  <div class="backdrop-blur-sm backdrop-brightness-50 absolute top-0 left-0 w-full h-full rounded-2xl"></div>
                  <button
                    className="relative flex gap-2 p-2 bg-white/20 w-full rounded-2xl"
                    type="button"
                    onClick={() => {
                      onPlay(item.id);
                    }}
                  >
                    <div className="w-1/2">
                      <img
                        src={item.image}
                        className="w-full"
                        loading="lazy"
                        width="360"
                        height="202"
                        alt={item.title}
                      />
                    </div>
                    <div className="w-1/2 text-left">
                      <p className="line-clamp-2 font-text font-bold">
                        {item.title}
                      </p>
                      <em className="text-xs">{item.channel}</em>
                    </div>
                  </button>
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
  );
}

export async function loader({ request }) {
  const [, searchParams] = request.url.split("?");
  const keyword = new URLSearchParams(searchParams).get("keyword");

  return await search(keyword);
}
