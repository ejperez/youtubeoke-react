import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Player from "./routes/Player.jsx";
import Remote from "./routes/Remote.jsx";
import RemoteSearch, {
  loader as RemoteSearchLoader,
} from "./components/RemoteSearch.jsx";
import { Spinner } from "./components/Loader.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Player />,
  },
  {
    path: "/:playerID/remote",
    element: <Remote />,
    children: [
      {
        path: "/:playerID/remote/search",
        element: <RemoteSearch />,
        loader: RemoteSearchLoader,
        hydrateFallbackElement: <Spinner />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
