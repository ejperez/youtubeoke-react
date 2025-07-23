const decodeEntity = (inputStr) => {
  var textarea = document.createElement("textarea");
  textarea.innerHTML = inputStr;
  return textarea.value;
};

const search = async (keyword) => {
  const backendAPI = import.meta.env.VITE_YT_API_URL || "http://localhost:3030";
  const request = await fetch(`${backendAPI}${keyword}`);
  const data = await request.json();
  let items = [];

  if ("items" in data && data.items.length > 0) {
    items = data.items.map((item) => {
      return {
        id: item.id.videoId,
        title: decodeEntity(item.snippet.title),
        channel: item.snippet.channelTitle,
        image: item.snippet.thumbnails.medium.url,
      };
    });
  }

  return items;
};

export { search };
