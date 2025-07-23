import { useEffect, useState } from "react";
import { search } from "../util/yt";
import { getSocket } from "../util/socket";

export default function RemoteMain({ playerID }) {
  const [currentKeyword, setCurrentKeyword] = useState("karaoke");
  const [keyword, setKeyword] = useState("karaoke");
  const [items, setItems] = useState([]);
  const socket = getSocket();

  useEffect(() => {
    async function getData() {
      const items = await search(currentKeyword);
      setItems(items);
    }
    getData();
  }, [currentKeyword]);

  useEffect(() => {
    socket.on("sync-event", (data) => {
      console.log(data);

      switch (data.action) {
        case "test-player-id":
          if (id === data.payload) {
            socket.emit("sync-event", {
              action: "test-player-id-ok",
              payload: data.payload,
            });
          }
          break;
      }
    });

    return () => {
      socket.off("sync-event");
    };
  }, []);

  const searchClickHandler = () => {
    setCurrentKeyword(keyword);
  };

  const playClickHandler = (videoID) => {
    socket.emit("sync-event", {
      action: "play-item",
      payload: {
        playerID: playerID,
        videoID: videoID,
      },
    });
  };

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
        <button onClick={searchClickHandler} ype="button">
          Search
        </button>
      </p>
      <div>
        {items.length === 0 ? (
          <p>No results.</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <img src={item.image} width="200" loading="lazy" />
                <p>{item.title}</p>
                <em>{item.channel}</em>
                <div>
                  <button type="button">Queue</button>
                  <button
                    type="button"
                    onClick={() => {
                      playClickHandler(item.id);
                    }}
                  >
                    Play
                  </button>
                  <button type="button">Favorite</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
