import YouTube from "react-youtube";

export default function PlayerFrame({ videoID }) {
  const opts = {
    height: "1280",
    width: "720",
    playerVars: {
      autoplay: 1,
      controls: 0,
      rel: 0,
      showinfo: 0,
      enablejsapi: 1,
    },
  };

  return (
    <YouTube
      className="w-screen h-screen"
      videoId={videoID}
      opts={opts}
      iframeClassName="h-full w-full"
    />
  );
}
