import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  RoomContext,
  useTracks,
} from "@livekit/components-react";
import { Room, Track } from "livekit-client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import Container from "@/layouts/Container";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const serverUrl = "wss://daily-immune-heiwg6hm.livekit.cloud";

export default function WatchStream() {
  const { id } = useParams();
  const [token, setToken] = useState("");
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const [room] = useState(
    () =>
      new Room({
        adaptiveStream: true,
        dynacast: true,
      })
  );

  // Fetch viewer token
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/getViewerToken?roomId=${id}`)
      .then((response) => setToken(response.data))
      .catch(() => setConnectionError("Failed to get viewer token"));
  }, [id]);

  // Connect with viewer token
  useEffect(() => {
    if (!token) return;
    const connect = async () => {
      try {
        setIsConnecting(true);
        await room.connect(serverUrl, token);
        setIsConnecting(false);
      } catch (err) {
        console.error(err);
        setConnectionError("Failed to connect as viewer");
        setIsConnecting(false);
      }
    };
    connect();
    return () => {
      room.disconnect();
    };
  }, [room, token]);

  return (
    <Container>
      <div className="bg-black text-white flex flex-col">
        {isConnecting && <p className="text-center p-4">Connecting…</p>}
        {connectionError && (
          <p className="text-center p-4">{connectionError}</p>
        )}
        <RoomContext.Provider value={room}>
          <div
            style={{ height: "70vh", minHeight: "600px" }}
            className="relative"
          >
            <ViewerConference />
            <RoomAudioRenderer />

            {/* Optional viewer controls (volume, full screen, etc.) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex justify-center">
                <ControlBar controls={{ camera: false, microphone: false }} />
              </div>
            </div>
          </div>
        </RoomContext.Provider>
      </div>
    </Container>
  );
}

function ViewerConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.Microphone, withPlaceholder: false },
    ],
    { onlySubscribed: true }
  );

  // 👉 filter out viewer tiles (anyone who isn’t the host)
  const hostTracks = tracks.filter(
    (track) =>
      track.participant.identity.startsWith("host-") &&
      track.publication?.source === Track.Source.Camera
  );

  return (
    <GridLayout tracks={hostTracks} style={{ height: "100%" }}>
      <ParticipantTile />
    </GridLayout>
  );
}
