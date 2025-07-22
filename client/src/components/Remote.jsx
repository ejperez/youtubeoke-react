import { useState } from "react";
import RemoteLogin from "./RemoteLogin";
import RemoteMain from "./RemoteMain";

export default function Remote() {
  const [playerID, setPlayerID] = useState(null);

  return playerID ? (
    <RemoteMain playerID={playerID} />
  ) : (
    <RemoteLogin onSetPlayerID={setPlayerID} />
  );
}
