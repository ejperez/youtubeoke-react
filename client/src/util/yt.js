const search = async (keyword) => {
  const backendAPI = import.meta.env.VITE_YT_API_URL || "http://localhost:3030";
  const request = await fetch(`${backendAPI}${keyword}`);

  return await request.json();
};

export { search };
