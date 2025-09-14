import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  useParticipants,
  RoomContext,
  Chat,
} from "@livekit/components-react";
import {
  Room,
  Track,
  RemoteParticipant,
  LocalParticipant,
} from "livekit-client";
import "@livekit/components-styles";
import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import Container from "@/layouts/Container";
import { useParams } from "react-router";
import { useSocket } from "@/context/useSocket";
import { toast, Toaster } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const SERVER_URL = "wss://daily-immune-heiwg6hm.livekit.cloud";

// Types
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

// Custom hooks
const useEventData = (eventId: string | undefined) => {
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
    if (!eventId) return;

    axios
      .get(`${BACKEND_URL}/api/v1/events/${eventId}`)
      .then((response) => setEvent(response.data))
      .catch((error) => console.error("Event fetch error:", error));
  }, [eventId]);

  return event;
};

const useRoomConnection = (roomId: string | undefined) => {
  const [token, setToken] = useState("");
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { socket } = useSocket();

  const room = useMemo(
    () =>
      new Room({
        adaptiveStream: true,
        dynacast: true,
        // Additional optimizations
        disconnectOnPageLeave: true,
        stopLocalTrackOnUnpublish: true,
      }),
    []
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

    socket.emit("user-joined-stream", roomId);
    socket.on("update-stream-details", handleUpdate);

    return () => {
      socket.off("update-stream-details", handleUpdate);
    };
  }, [roomId, socket]);

  // Fetch token
  useEffect(() => {
    if (!roomId) return;

    axios
      .get(`${BACKEND_URL}/getHostToken?roomId=${roomId}`, {
        withCredentials: true,
      })
      .then((response) => {
        setToken(response.data);
        setConnectionError(null);
      })
      .catch((error) => {
        setConnectionError("Failed to get authentication token");
        console.error("Token error:", error);
        setIsConnecting(false);
      });
  }, [roomId]);

  // Connect to room
  useEffect(() => {
    let mounted = true;

    const connect = async () => {
      if (!mounted || !token) return;

      try {
        setIsConnecting(true);
        setConnectionError(null);

        await room.connect(SERVER_URL, token);
        await Promise.all([
          room.localParticipant.setCameraEnabled(true),
          room.localParticipant.setMicrophoneEnabled(true),
        ]);

        setIsConnecting(false);
      } catch (error) {
        if (mounted) {
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

  return { room, isConnecting, connectionError };
};

// Components
const StatusAlert = ({
  type,
  children,
}: {
  type: "loading" | "error";
  children: React.ReactNode;
}) => {
  const styles = {
    loading:
      "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-400/40 text-blue-200",
    error:
      "bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-400/40 text-red-200",
  };

  return (
    <div
      className={`${styles[type]} border backdrop-blur-md rounded-xl p-4 mb-6 shadow-lg`}
    >
      <Toaster />
      <div className="flex items-center gap-3">
        {type === "loading" && (
          <div className="relative">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-transparent border-t-blue-400"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-5 w-5 bg-blue-400/20"></div>
          </div>
        )}
        {type === "error" && (
          <div className="relative">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        <span className="font-medium">{children}</span>
      </div>
    </div>
  );
};

// New Participants Panel Component
const ParticipantsPanel = ({
  isOpen,
  onClose,
  participants,
}: {
  isOpen: boolean;
  onClose: () => void;
  participants: (RemoteParticipant | LocalParticipant)[];
}) => {
  if (!isOpen) return null;

  const getParticipantInitials = (name: string) => {
    return (
      name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  const getParticipantName = (
    participant: RemoteParticipant | LocalParticipant
  ) => {
    if (participant.metadata) {
      const data = JSON.parse(participant.metadata);
      return data.name;
    } else {
      return participant.identity || "Anonymous";
    }
  };

  const isHost = (participant: RemoteParticipant | LocalParticipant) => {
    return participant.identity.startsWith("host-");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Participants ({participants.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Participants List */}
        <div className="overflow-y-auto max-h-96 p-6">
          <div className="space-y-3">
            {participants.map((participant, index) => (
              <div
                key={participant.sid || index}
                className="flex items-center gap-4 p-4 bg-white/60 hover:bg-white/80 rounded-xl border border-gray-100 transition-all duration-200"
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">
                      {getParticipantInitials(getParticipantName(participant))}
                    </span>
                  </div>

                  {isHost(participant) && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
                      <svg
                        className="w-2 h-2 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800">
                      {getParticipantName(participant)}
                    </p>
                    {isHost(participant) && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        Host
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {participant.connectionQuality
                      ? `Connection: ${participant.connectionQuality}`
                      : "Connected"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Microphone status */}
                  <div
                    className={`p-1 rounded ${
                      participant.isMicrophoneEnabled
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      {participant.isMicrophoneEnabled ? (
                        <path
                          fillRule="evenodd"
                          d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                          clipRule="evenodd"
                        />
                      ) : (
                        <path
                          fillRule="evenodd"
                          d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A7.001 7.001 0 0017 8a1 1 0 10-2 0 5 5 0 01-.841 2.77L12.5 9.112A3 3 0 0013 8V4a3 3 0 00-6 0v.879L3.707 2.293zM11 11.121L7.121 7.242A3.001 3.001 0 007 8v4c0 .364.065.714.184 1.039L5.757 14.466a7.001 7.001 0 01-.757-6.359V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07c.47-.07.94-.18 1.39-.34L11 11.121z"
                          clipRule="evenodd"
                        />
                      )}
                    </svg>
                  </div>

                  {/* Camera status */}
                  <div
                    className={`p-1 rounded ${
                      participant.isCameraEnabled
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      {participant.isCameraEnabled ? (
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586l-.707-.707A1 1 0 0013 4H7a1 1 0 00-.707.293L5.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                      ) : (
                        <path
                          fillRule="evenodd"
                          d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A2 2 0 0018 13V7a2 2 0 00-2-2h-1.586l-.707-.707A1 1 0 0013 4H7a1 1 0 00-.707.293L5.586 5H4a2 2 0 00-2 2v6c0 .362.097.701.268.993L3.707 2.293z"
                          clipRule="evenodd"
                        />
                      )}
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const EventHeader = ({
  event,
  participantCount,
  onShowParticipants,
}: {
  event: Event;
  participantCount: number;
  onShowParticipants: () => void;
}) => {
  const formatDate = useCallback((date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  return (
    <div className="relative  rounded-md mb-8 overflow-hidden">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-start gap-8">
        <div className="flex-1">
          <div className="mb-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-sm font-medium border border-red-400/30">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                LIVE
              </div>

              {/* Participant Count Button */}
              <button
                onClick={onShowParticipants}
                className="inline-flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 px-4 py-2 rounded-full text-sm font-medium border border-blue-400/30 transition-all duration-200 hover:scale-105"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                {participantCount}{" "}
                {participantCount === 1 ? "Viewer" : "Viewers"}
              </button>
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              {event.title || "Loading Event..."}
            </h1>
          </div>

          {event.description && (
            <p className="text-gray-500 text-lg mb-4 leading-relaxed max-w-3xl">
              {event.description}
            </p>
          )}

          <div className="flex flex-wrap gap-4">
            <div className="group flex items-center gap-3 bg-white/10 hover:bg-white/15 transition-all duration-300 rounded-2xl py-3 border border-white/10 hover:border-white/20">
              <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
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
              </div>
              <span className="text-gray-500 font-medium">
                {formatDate(event.date)}
              </span>
            </div>

            <div className="group flex items-center gap-3 bg-white/10 hover:bg-white/15 transition-all duration-300 rounded-2xl px-5 py-3 border border-white/10 hover:border-white/20">
              <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
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
              </div>
              <span className="text-gray-500 font-medium">
                {event.duration}
              </span>
            </div>
          </div>
        </div>

        {/* Host Information */}
        {event.host.firstName && (
          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-2xl p-6 min-w-[280px] border border-gray-300">
            <h3 className="font-semibold mb-4 text-lg">Hosted by</h3>
            <div className="flex items-center gap-4">
              {event.host.profilePhoto ? (
                <img
                  src={event.host.profilePhoto}
                  alt={`${event.host.firstName} ${event.host.lastName}`}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">
                    {event.host.firstName[0]}
                    {event.host.lastName[0]}
                  </span>
                </div>
              )}
              <div>
                <p className="font-semibold text-lg">
                  {event.host.firstName} {event.host.lastName}
                </p>
                <p className="text-slate-400 text-sm font-medium">Event Host</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const VideoConference = ({ room }: { room: Room }) => {
  return (
    <div className="relative bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10">
      <RoomContext.Provider value={room}>
        <div
          data-lk-theme="default"
          className="relative flex flex-col-reverse md:flex-row-reverse  w-full"
          //style={{ height: "75vh", minHeight: "650px" }}
        >
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

          {/* Video Area */}
          <div className="flex-1 relative">
            <MyVideoConference />
            <RoomAudioRenderer />

            {/* Enhanced Control Bar */}
            <div className="absolute bottom-0 left-0 right-0">
              <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6">
                <div className="flex justify-center">
                  <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 p-3 shadow-2xl">
                    <ControlBar
                      style={
                        {
                          "--lk-bg": "transparent",
                          "--lk-button-bg": "rgba(255, 255, 255, 0.1)",
                          "--lk-button-bg-hover": "rgba(255, 255, 255, 0.2)",
                        } as React.CSSProperties
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RoomContext.Provider>
    </div>
  );
};

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.Microphone, withPlaceholder: false },
    ],
    { onlySubscribed: true }
  );

  // Filter host tracks with better logic
  const hostTracks = useMemo(
    () =>
      tracks.filter(
        (track) =>
          track.participant.identity.startsWith("host-") &&
          track.publication?.source === Track.Source.Camera
      ),
    [tracks]
  );

  return (
    <GridLayout
      tracks={hostTracks}
      style={{ height: "100%" }}
      className="rounded-2xl overflow-hidden"
    >
      <ParticipantTile
        className="rounded-2xl shadow-lg border border-white/10"
        style={
          {
            "--lk-bg": "rgba(0, 0, 0, 0.2)",
            "--lk-fg": "rgb(248 250 252)",
          } as React.CSSProperties
        }
      />
    </GridLayout>
  );
}

const AdditionalNotes = ({ notes }: { notes: string }) => (
  <div className="bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-orange-500/10 backdrop-blur-md rounded-2xl p-6 mt-8 border border-amber-300">
    <h3 className="font-semibold mb-4 text-xl flex items-center gap-3">
      <div className="p-2 bg-amber-500/20 rounded-lg">
        <svg
          className="w-5 h-5 text-amber-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      Additional Notes
    </h3>
    <p className="text-gray-500 leading-relaxed text-lg">{notes}</p>
  </div>
);

// Main Component
export default function LiveStream() {
  const { id } = useParams();
  const event = useEventData(id);
  const { room, isConnecting, connectionError } = useRoomConnection(id);
  const [showParticipants, setShowParticipants] = useState(false);

  // Get participants using LiveKit hook
  const participants = useParticipants({ room });

  return (
    <div className="min-h-screen bg-white">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div
            className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>
      </div>

      <Container>
        <div className="relative z-10 py-8">
          <EventHeader
            event={event}
            participantCount={participants.length}
            onShowParticipants={() => setShowParticipants(true)}
          />

          {isConnecting && (
            <StatusAlert type="loading">
              Connecting to livestream...
            </StatusAlert>
          )}

          {connectionError && (
            <StatusAlert type="error">{connectionError}</StatusAlert>
          )}

          <VideoConference room={room} />

          {event.additionalNotes && (
            <AdditionalNotes notes={event.additionalNotes} />
          )}
        </div>
      </Container>

      {/* Participants Panel */}
      <ParticipantsPanel
        isOpen={showParticipants}
        onClose={() => setShowParticipants(false)}
        participants={participants}
      />
    </div>
  );
}
