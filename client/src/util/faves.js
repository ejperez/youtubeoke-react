export const addToFavorites = async (item) => {
  return new Promise((resolve) => {
    const currentFaveIDs = JSON.parse(localStorage.getItem("fave_ids") || "[]");
    const currentFaves = JSON.parse(localStorage.getItem("faves") || "[]");

    if (currentFaveIDs.includes(item.id)) {
      return resolve(currentFaves);
    }

    const newCurrentFaveIDS = [...currentFaveIDs, item.id];
    const newCurrentFaves = [...currentFaves, item];

    localStorage.setItem("fave_ids", JSON.stringify(newCurrentFaveIDS));
    localStorage.setItem("faves", JSON.stringify(newCurrentFaves));

    return resolve(newCurrentFaves);
  });
};

export const getFavorites = () => {
  return new Promise((resolve) => {
    const currentFaves = JSON.parse(localStorage.getItem("faves") || "[]");

    return resolve(currentFaves);
  });
};

export const isInFavorites = async (id) => {
  return new Promise((resolve) => {
    if (!("localStorage" in window)) {
      return resolve(false);
    }

    const currentFaveIDs = JSON.parse(localStorage.getItem("fave_ids") || "[]");

    return resolve(currentFaveIDs.includes(id));
  });
};

export const removeFromFavorites = async (id) => {
  return new Promise((resolve) => {
    const currentFaveIDs = JSON.parse(localStorage.getItem("fave_ids") || "[]");
    const currentFaves = JSON.parse(localStorage.getItem("faves") || "[]");

    const newCurrentFaveIDS = currentFaveIDs.filter((item) => item !== id);
    const newCurrentFaves = currentFaves.filter((item) => item.id !== id);

    localStorage.setItem("fave_ids", JSON.stringify(newCurrentFaveIDS));
    localStorage.setItem("faves", JSON.stringify(newCurrentFaves));

    return resolve(newCurrentFaves);
  });
};
