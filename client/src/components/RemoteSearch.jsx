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
          <ul className="flex gap-2 flex-col">
            {items.map((item) => (
              <li className="border-1 p-2 rounded-2xl" key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    onPlay(item.id);
                  }}
                >
                  <img src={item.image} className="w-full" loading="lazy" />
                </button>
                <p>{item.title}</p>
                <em>{item.channel}</em>
                <div>
                  {/* <button
                    type="button"
                    onClick={() => {
                      onFavorite(item.id);
                    }}
                  >
                    Favorite
                  </button> */}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
