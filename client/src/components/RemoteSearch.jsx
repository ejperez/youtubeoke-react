import { useState, useEffect } from "react";
import { search } from "../util/yt";

export default function RemoteSearch({ onPlay, onFavorite }) {
  const [keyword, setKeyword] = useState("karaoke");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);

      const items = await search(keyword);

      setItems(items);
      setIsLoading(false);
    }
    getData();
  }, [keyword]);

  const formSubmitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const keyword = formData.get("keyword");

    if (!keyword) {
      return;
    }

    setKeyword(formData.get("keyword"));
  };

  return (
    <div>
      <form onSubmit={formSubmitHandler} className="fixed w-full p-2">
        <input
          className="w-full bg-white p-3 rounded-full border-1"
          name="keyword"
          type="text"
          placeholder="Search YouTube"
        />
      </form>

      <div className="p-2 pt-16">
        {isLoading ? (
          <div>Loading...</div>
        ) : items.length === 0 ? (
          <p>No results.</p>
        ) : (
          <>
            <ul className="flex flex-wrap gap-2">
              {items.map((item) => (
                <li
                  className="flex-auto w-full sm:w-1/3 md:w-1/5 p-2 bg-white/25 rounded-2xl"
                  key={item.id}
                >
                  <button
                    type="button"
                    className="w-full"
                    onClick={() => {
                      onPlay(item.id);
                    }}
                  >
                    <img
                      src={item.image}
                      className="w-full rounded-2xl"
                      loading="lazy"
                      width="360"
                      height="202"
                      alt={item.title}
                    />
                  </button>
                  <p className="font-custom font-bold">{item.title}</p>
                  <em className="font-bit">{item.channel}</em>
                  {/* <div>
                  <button
                    type="button"
                    onClick={() => {
                      onFavorite(item.id);
                    }}
                  >
                    Favorite
                  </button>
                </div> */}
                </li>
              ))}
            </ul>
            <button className="w-full p-2 bg-white/25 mt-2 rounded-2xl" type="button">Load more</button>
          </>
        )}
      </div>
    </div>
  );
}
