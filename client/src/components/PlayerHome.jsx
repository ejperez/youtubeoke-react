import QRCode from "react-qr-code";
import { Link } from "react-router";

export default function PlayerHome({ playerID }) {
  const remoteLink = `${document.location.href}${playerID}/remote`;

  return (
    <header className="fixed flex flex-col h-full w-full justify-center items-center">
      <div className="z-2 text-center p-2">
        <h1 className="text-center font-heading text-7xl">
          Welcome to YoutubeOKE
        </h1>
        <p className="mt-2">
          Scan the QR code below using your phone to play songs.
        </p>
        <p className="mt-8 flex justify-center">
          <Link
            to={remoteLink}
            target="_blank"
            title={`Click to open in a new tab (Player ID: ${playerID})`}
          >
            <QRCode className="p-2 rounded-xl bg-white" value={remoteLink} />
          </Link>
        </p>
      </div>
      <video
        className="absolute top-[-100px] w-auto min-w-full min-h-[120%] max-w-none opacity-50"
        autoPlay
        loop
        muted
      >
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </header>
  );
}
