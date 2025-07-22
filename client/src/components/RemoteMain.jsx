import { useEffect, useState } from "react";
import { search } from "../util/yt";

export default function RemoteMain({ playerID }) {
  const [currentKeyword, setCurrentKeyword] = useState("karaoke");
  const [keyword, setKeyword] = useState("karaoke");
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function getData() {
      const data = await search(currentKeyword);
      let currentItems = [];

      if ("items" in data && data.items.length > 0) {
        currentItems = data.items.map((item) => {
          return {
            id: item.id.videoId,
            title: decodeEntity(item.snippet.title),
            channel: item.snippet.channelTitle,
            image: item.snippet.thumbnails.medium.url,
          };
        });
      }
    }

    getData();
  }, [currentKeyword]);

  return (
    <div>
      Remote (Player ID: {playerID})
      <p>
        <input
          type="text"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
        />
        <button type="button">Search</button>
      </p>
      <p>
        {items.length ? (
          <p>No results.</p>
        ) : (
          <p>
            <ul>{items.map((item) => {})}</ul>
          </p>
        )}
      </p>
    </div>
  );
}
