import { search } from "../util/yt";
import { useLoaderData } from "react-router";

export default function RemoteSearch({ onPlay, onFavorite }) {
  const items = useLoaderData();

  return (
    <div className="p-2 pt-16">
      {items.length === 0 ? (
        <p>No results.</p>
      ) : (
        <>
          <ul className="flex flex-col gap-2">
            {items.map((item) => (
              <li key={item.id + item.image}>
                <button
                  className="relative flex gap-2 p-2 bg-white/20"
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
          <button
            className="w-full p-2 bg-white/25 mt-2 rounded-2xl"
            type="button"
          >
            Load more
          </button>
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
