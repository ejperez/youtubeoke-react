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
import RemoteFaves, {
  loader as RemoteFavesLoader,
} from "./components/RemoteFaves.jsx";

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
        path: "/:playerID/remote",
        element: <RemoteFaves />,
        loader: RemoteFavesLoader,
        hydrateFallbackElement: <Spinner />,
      },
      {
        path: "/:playerID/remote/search",
        element: <RemoteSearch />,
        loader: RemoteSearchLoader,
        hydrateFallbackElement: <Spinner />,
      },
    ],
  },
]);

const storageSupport = "localStorage" in window && "sessionStorage" in window;

if (storageSupport) {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
} else {
  document.writeln("This app needs local and session storage features.");
}
