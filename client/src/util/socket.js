import { io } from "socket.io-client";

const getSocket = () => {
  return io(import.meta.env.VITE_WS_URL || "http://localhost:3000");
};

export { getSocket };
