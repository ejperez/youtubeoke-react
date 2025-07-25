import { useNavigation } from "react-router";

export function Spinner() {
  return (
    <div className="loading-container">
      <div className="loading-icon"></div>
    </div>
  );
}

export default function Loader({ children }) {
  const { state } = useNavigation();

  return state === "loading" ? <Spinner /> : children;
}
