import QRCode from "react-qr-code";
import { Link } from "react-router";

export default function PlayerHome({ playerID }) {
  const remoteLink = `${document.location.href}${playerID}/remote`;

  return (
    <div>
      <h1>Welcome to YoutubeOKE</h1>
      <p>Scan the QR code using your phone to play songs.</p>
      <Link to={remoteLink} target="_blank" title="Click to open in a new tab">
        <QRCode value={remoteLink} />
      </Link>
    </div>
  );
}
