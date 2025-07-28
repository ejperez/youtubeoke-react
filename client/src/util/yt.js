const backendAPI = import.meta.env.VITE_YT_API_URL || "http://localhost:3030";

const decodeEntity = (inputStr) => {
  var textarea = document.createElement("textarea");
  textarea.innerHTML = inputStr;
  return textarea.value;
};

const mapFields = (items) =>
  items.map((item) => {
    return {
      id: item?.id,
      title: decodeEntity(item?.title),
      channel: item.channelTitle,
      image: item.thumbnail.thumbnails.shift()?.url,
    };
  });

const processResponse = (data) => {
  const hasNextPage = "nextPage" in data;
  let items = [];

  if (data.items.length > 0) {
    items = mapFields(data.items);
  }

  if ("sessionStorage" in window) {
    if (hasNextPage) {
      sessionStorage.setItem(
        "nextPage",
        JSON.stringify({ nextPage: data.nextPage })
      );
    } else {
      sessionStorage.removeItem("nextPage");
    }
  }

  return {
    items: items,
    hasNextPage: hasNextPage,
  };
};

const search = async (keyword) => {
  const request = await fetch(`${backendAPI}/search/${keyword}`);
  const data = await request.json();

  return processResponse(data);
};

const getNextPage = async () => {
  const defaultResponse = { items: [], hasNextPage: false };

  if (!("sessionStorage" in window)) {
    return defaultResponse;
  }

  const nextPage = sessionStorage.getItem("nextPage");

  if (!nextPage) {
    return defaultResponse;
  }

  const request = await fetch(`${backendAPI}/search/nextPage`, {
    method: "POST",
    body: nextPage,
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await request.json();

  return processResponse(data);
};

export { search, getNextPage };
