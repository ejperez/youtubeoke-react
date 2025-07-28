import { useNavigation } from "react-router";

export function Spinner() {
  return (
    <div className="fixed flex justify-center items-center h-full w-full">
      <div className="loading-icon"></div>
    </div>
  );
}

export default function Loader({ children }) {
  const { state } = useNavigation();

  return state === "loading" ? <Spinner /> : children;
}
