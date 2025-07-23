export default function PlayerFrame({ videoID }) {
  return (
    <iframe
      width="560"
      height="315"
      src={`https://www.youtube.com/embed/${videoID}?autoplay=1&controls=0&rel=0&showinfo=0`}
      title="YouTube video player"
      frameborder="0"
      allowfullscreen
    ></iframe>
  );
}
