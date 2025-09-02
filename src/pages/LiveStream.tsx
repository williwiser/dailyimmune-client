import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
} from "@livekit/components-react";
import { Room, Track } from "livekit-client";
import "@livekit/components-styles";
import { useEffect, useState } from "react";
import axios from "axios";
import Container from "@/layouts/Container";
import { useParams } from "react-router";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const serverUrl = "wss://daily-immune-heiwg6hm.livekit.cloud";

interface User {
  id: string;
  profilePhoto: string;
  firstName: string;
  lastName: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  additionalNotes: string;
  date: Date;
  host: User;
  duration: string;
}

export default function LiveStream() {
  const { id } = useParams();
  const [token, setToken] = useState("");
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [event, setEvent] = useState<Event>({
    id: "",
    title: "",
    additionalNotes: "",
    host: { id: "", firstName: "", lastName: "", profilePhoto: "" },
    description: "",
    date: new Date("2025-09-15T19:00:00"),
    duration: "2 hours",
  });

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/getHostToken?roomId=${id}`)
      .then((response) => {
        setToken(response.data);
      })
      .catch((error) => {
        setConnectionError("Failed to get authentication token");
        console.error("Token error:", error);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/events/${id}`)
      .then((response) => {
        setEvent(response.data);
      })
      .catch((error) => {
        console.error("Event fetch error:", error);
      });
  }, [id]);

  const [room] = useState(
    () =>
      new Room({
        // Optimize video quality for each participant's screen
        adaptiveStream: true,
        // Enable automatic audio/video quality optimization
        dynacast: true,
      })
  );

  // Connect to room
  useEffect(() => {
    let mounted = true;
    const connect = async () => {
      if (mounted && token) {
        try {
          setIsConnecting(true);
          await room.connect(serverUrl, token);
          await room.localParticipant.setCameraEnabled(true);
          await room.localParticipant.setMicrophoneEnabled(true);
          setIsConnecting(false);
          setConnectionError(null);
        } catch (error) {
          setConnectionError("Failed to connect to livestream");
          setIsConnecting(false);
          console.error("Connection error:", error);
        }
      }
    };
    connect();
    return () => {
      mounted = false;
      room.disconnect();
    };
  }, [room, token]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Container>
        <div className="py-6">
          {/* Header Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              <div className="flex-1">
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                  {event.title || "Loading Event..."}
                </h1>

                {event.description && (
                  <p className="text-slate-300 text-lg mb-4 leading-relaxed">
                    {event.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                    <svg
                      className="w-4 h-4 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-white font-medium">
                      {formatDate(event.date)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                    <svg
                      className="w-4 h-4 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-white font-medium">
                      {event.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Host Information */}
              {event.host.firstName && (
                <div className="bg-white/10 rounded-xl p-4 min-w-[250px]">
                  <h3 className="text-white font-semibold mb-3">Hosted by</h3>
                  <div className="flex items-center gap-3">
                    {event.host.profilePhoto ? (
                      <img
                        src={event.host.profilePhoto}
                        alt={`${event.host.firstName} ${event.host.lastName}`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {event.host.firstName[0]}
                          {event.host.lastName[0]}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">
                        {event.host.firstName} {event.host.lastName}
                      </p>
                      <p className="text-slate-400 text-sm">Event Host</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Connection Status */}
          {isConnecting && (
            <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                <span className="text-blue-300">
                  Connecting to livestream...
                </span>
              </div>
            </div>
          )}

          {connectionError && (
            <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-red-300">{connectionError}</span>
              </div>
            </div>
          )}

          {/* Video Conference Section */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <RoomContext.Provider value={room}>
              <div
                data-lk-theme="default"
                className="relative"
                style={{ height: "70vh", minHeight: "600px" }}
              >
                <MyVideoConference />
                <RoomAudioRenderer />

                {/* Custom Control Bar Wrapper */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex justify-center">
                    <div className="bg-black/60 backdrop-blur-md rounded-full border border-white/20 p-2">
                      <ControlBar />
                    </div>
                  </div>
                </div>
              </div>
            </RoomContext.Provider>
          </div>

          {/* Additional Notes Section */}
          {event.additionalNotes && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mt-6 border border-white/10">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Additional Notes
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {event.additionalNotes}
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

function MyVideoConference() {
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
    <GridLayout
      tracks={hostTracks}
      style={{ height: "100%" }}
      className="rounded-lg overflow-hidden"
    >
      <ParticipantTile className="rounded-lg" />
    </GridLayout>
  );
}
