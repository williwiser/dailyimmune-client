import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  RoomContext,
  Chat,
  useTracks,
} from "@livekit/components-react";
import {
  LocalParticipant,
  RemoteParticipant,
  Room,
  Track,
} from "livekit-client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import Container from "@/layouts/Container";
import "@livekit/components-styles";
import { useSocket } from "@/context/useSocket";
import { toast, Toaster } from "sonner";
import { useAuth } from "@/context/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const serverUrl = "wss://daily-immune-heiwg6hm.livekit.cloud";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
}

export default function WatchStream() {
  const { id } = useParams();
  const [token, setToken] = useState("");
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { socket } = useSocket();
  const { user } = useAuth();

  const [room] = useState(
    () =>
      new Room({
        adaptiveStream: true,
        dynacast: true,
      })
  );

  useEffect(() => {
    const handleUpdate = ({
      participants,
      newUser,
    }: {
      participants: LocalParticipant[] | RemoteParticipant[];
      newUser: User;
    }) => {
      console.log(participants);
      toast(`${newUser.firstName} ${newUser.lastName} just joined`, {
        icon: <FontAwesomeIcon icon={faUser} />,
      });
    };

    socket.emit("user-joined-stream", { id, user });
    socket.on("update-stream-details", handleUpdate);

    return () => {
      socket.off("update-stream-details", handleUpdate);
    };
  }, [id, socket, user]);

  // Fetch viewer token
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/getViewerToken?roomId=${id}`, {
        withCredentials: true,
      })
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
      <Toaster />
      <div className="bg-black text-white flex flex-col">
        {isConnecting && <p className="text-center p-4">Connecting…</p>}
        {connectionError && (
          <p className="text-center p-4">{connectionError}</p>
        )}
        <RoomContext.Provider value={room}>
          <div
            data-lk-theme="default"
            className="flex flex-col md:flex-row relative h-96"
          >
            <ViewerConference />
            <RoomAudioRenderer />

            {/* Optional viewer controls (volume, full screen, etc.) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex justify-center">
                <ControlBar controls={{ camera: false, microphone: false }} />
              </div>
            </div>
            {/* Chat Panel with improved styling */}
            <div className="flex w-full md:w-80 bg-black/40 backdrop-blur-md border-r border-white/10">
              <Chat
                className="flex-1 h-full w-full"
                style={
                  {
                    "--lk-bg": "transparent",
                    "--lk-fg": "rgb(248 250 252)",
                  } as React.CSSProperties
                }
              />
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
