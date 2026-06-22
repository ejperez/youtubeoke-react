import { useNavigation } from "react-router";

export function SpinnerIcon({ inline }) {
  if (inline) {
    return (
      <div className="loading-icon inline-block w-5! h-5! leading-5">
        &nbsp;
      </div>
    );
  }

  return <div className="loading-icon"></div>;
}

export function Spinner() {
  return (
    <div className="fixed flex justify-center items-center h-full w-full -mt-16">
      <SpinnerIcon />
    </div>
  );
}

export default function Loader({ children }) {
  const { state } = useNavigation();

  return state === "loading" ? <Spinner /> : children;
}
