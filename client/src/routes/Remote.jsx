import { useParams, useSearchParams, Outlet, Link, Form } from "react-router";
import Loader from "../components/Loader";
import { useRef, useState } from "react";
import { cn } from "../util/util";
import { useLocation } from "react-router";

export default function Remote() {
  const { playerID } = useParams();
  const [searchParams, _] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const keywordField = useRef(null);
  const location = useLocation();
  const [currentView, setCurrentView] = useState(
    location.pathname.includes("/search")
      ? "search"
      : location.pathname.includes("/queue")
        ? "queue"
        : "faves",
  );

  return (
    <>
      <div className="flex fixed top-0 z-1 w-full bg-black/50 p-2">
        <div className="grow">
          <Form
            action={`/${playerID}/remote/search`}
            method="get"
            className="relative z-3"
          >
            <input
              className={cn(
                "w-full bg-black text-white! placeholder:text-white! border-white pl-3 py-2 pr-9 rounded-full border-2",
                {
                  "bg-white text-black! ": currentView === "search",
                },
              )}
              name="keyword"
              type="text"
              placeholder="Search YouTube"
              defaultValue={keyword}
              required
              ref={keywordField}
              onFocus={() => setCurrentView("search")}
            />

            <svg
              className="size-6 absolute right-3 top-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="16.65" y1="16.65" x2="21" y2="21" />
            </svg>
          </Form>
        </div>
        <div className="flex items-center pl-1 gap-1">
          <Link
            to={`/${playerID}/remote`}
            title="Click to see favorites"
            className={cn("size-10 inline-block rounded-full border-2 p-1", {
              "bg-white text-black border-white": currentView === "faves",
            })}
            onClick={() => {
              keywordField.current.value = "";
              setCurrentView("faves");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke={currentView === "faves" ? "#000" : "#FFF"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </Link>

          <Link
            to={`/${playerID}/remote/queue`}
            title="Click to see queue"
            className={cn("size-10 inline-block rounded-full border-2 p-1", {
              "bg-white text-black border-white": currentView === "queue",
            })}
            onClick={() => {
              keywordField.current.value = "";
              setCurrentView("queue");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke={currentView === "queue" ? "#000" : "#FFF"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <circle cx="4" cy="6" r="1" />
              <circle cx="4" cy="12" r="1" />
              <circle cx="4" cy="18" r="1" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="mt-16">
        <Loader>
          <Outlet
            context={{
              clearKeyword: () => (keywordField.current.value = ""),
            }}
          />
        </Loader>
      </div>
    </>
  );
}
