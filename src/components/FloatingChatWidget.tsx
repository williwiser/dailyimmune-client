import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  X,
  MessageCircle,
  ChevronUp,
  Plus,
  ArrowLeft,
} from "lucide-react";
//import { useAuth } from "@/context/useAuth";
import { useSocket } from "@/context/useSocket";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";
import { useAuth } from "@/context/useAuth";
import PulseLoader from "react-spinners/PulseLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { toast, Toaster } from "sonner";

interface User {
  id: string;
  profilePhoto?: string;
  firstName: string;
  lastName: string;
}

interface Message {
  id: string;
  content: string;
  sender: "support" | "user";
  createdAt: Date;
  senderId?: string;
  read: boolean;
}

interface Conversation {
  id: string;
  acceptedBy?: string;
  roomId: string | null;
  admin: User | null;
  createdAt: Date;
  latestMessage: string;
  messages: Message[];
  userId?: string;
  unread: number;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(" ");
  if (words.length <= wordLimit) return text;

  return words.slice(0, wordLimit).join(" ") + "...";
};

const FloatingChatWidget = () => {
  //const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [chattingWith, setChattingWith] = useState<User | undefined>(undefined);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const { socket } = useSocket();
  const [, setUnreadConvs] = useState<Record<string, number>>();
  const [currentView, setCurrentView] = useState("conversations"); // 'conversations' or 'chat'
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [newConversation] = useState<Conversation>({
    id: Date.now().toString(),
    admin: null,
    roomId: null,
    latestMessage: "Hi! How can we help you today?",
    createdAt: new Date(),
    unread: 0,
    messages: [
      {
        id: "1",
        content: "Hi! How can we help you today?",
        sender: "support",
        createdAt: new Date(),
        read: true,
      },
    ],
  });
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getRoomId = (userId1: string, userId2: string) => {
    return `chat_${[userId1, userId2].sort().join("_")}`;
  };

  useEffect(() => {
    if (currentView === "chat") {
      scrollToBottom();
    }
  }, [conversations, currentView]);

  useEffect(() => {
    const unreadMap = conversations.reduce((acc, conv) => {
      if (conv.roomId) acc[conv.roomId] = conv.unread;
      return acc;
    }, {} as Record<string, number>);
    setUnreadConvs(unreadMap);
  }, [conversations]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    const days = diff / (1000 * 60 * 60 * 24);

    if (hours < 1) {
      return "Just now";
    } else if (hours < 24) {
      return `${Math.floor(hours)}h ago`;
    } else if (days < 7) {
      return `${Math.floor(days)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const createNewConversation = () => {
    socket.emit("start-chat-request");
    const conv: Conversation = {
      id: Date.now().toString(),
      admin: null,
      roomId: null,
      latestMessage: "Hi! How can we help you today?",
      createdAt: new Date(),
      unread: 0,
      messages: [
        {
          id: "1",
          content: "Hi! How can we help you today?",
          sender: "support",
          createdAt: new Date(),
          read: true,
        },
      ],
    };
    setConversations((prev) => [conv, ...prev]);
    setActiveConversationId(conv.id);
    setCurrentView("chat");
  };

  const openConversation = useCallback(
    (conversationId: string) => {
      setActiveConversationId(conversationId);
      const activeConversation = conversations.find(
        (conv) => conv.id === conversationId
      );
      if (activeConversation) {
        socket.emit("join-room", activeConversation.roomId);
        if (activeConversation.admin) {
          setChattingWith(activeConversation.admin);
        } else {
          setChattingWith(undefined);
        }
      } else {
        setChattingWith(undefined);
      }

      setCurrentView("chat");

      // Mark as read
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, unread: 0 } : conv
        )
      );
    },
    [conversations, socket]
  );

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !activeConversationId) return;
    const currentConversation = getCurrentConversation();
    socket.emit("send-message", {
      roomId: currentRoomId,
      message: inputMessage,
      senderId: user?.id,
      recipientId: currentConversation?.admin?.id,
    });
    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      createdAt: new Date(),
      read: true,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversationId) {
          const updatedMessages = [...conv.messages, newMessage];
          return {
            ...conv,
            messages: updatedMessages,
            latestMessage: inputMessage,
            createdAt: new Date(),
          };
        }
        return conv;
      })
    );

    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCurrentConversation = useCallback(() => {
    return conversations.find((conv) => conv.id === activeConversationId);
  }, [activeConversationId, conversations]);

  const handleClose = () => {
    setIsExpanded(false);
    setCurrentView("conversations");
    setActiveConversationId(null);
  };

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/chat-sessions/me`, { withCredentials: true })
      .then((response) => {
        setConversations(response.data);
        console.log("Chat sessions: ", response.data);
      });
  }, []);

  useEffect(() => {
    socket.on("chat-exists", ({ roomId }) => {
      console.log("chat exist");
      setConversations((prev) =>
        prev.filter((conv) => conv.id !== activeConversationId)
      );
      const targetConvo = conversations.find(
        (convo) => convo.roomId === roomId
      );
      if (targetConvo) {
        openConversation(targetConvo.id);
      }
    });

    return () => {
      socket.off("chat-exists");
    };
  }, [socket, conversations, openConversation, activeConversationId]);

  useEffect(() => {
    socket.on("chat-accepted", ({ roomId, admin }) => {
      setChattingWith(admin);
      console.log(admin);
      console.log(newConversation);
      const currentConvo = getCurrentConversation();
      if (currentConvo) {
        currentConvo.admin = admin;
        currentConvo.roomId = roomId;
      }
      console.log(roomId);
      setCurrentRoomId(roomId);
      socket.emit("join-room", roomId);
    });

    socket.on("receive-message", ({ sender, message, roomId }) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: message,
        sender: "support",
        createdAt: new Date(),
        read: false,
      };
      toast(
        <div className="flex gap-2 items-center">
          <Avatar className="border">
            <AvatarImage src={sender.profilePhoto} className="object-cover" />
            <AvatarFallback>{sender.firstName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">
              {sender.firstName} {sender.lastName}
            </p>
            <p className="text-gray-500">{truncateText(message, 10)}</p>
          </div>
        </div>
      );
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === activeConversationId) newMessage.read = true;
          const updatedMessages = [...conv.messages, newMessage];
          if (conv.roomId === roomId || conv.id === activeConversationId) {
            return {
              ...conv,
              messages: updatedMessages,
              latestMessage: message,
              unread: conv.id === activeConversationId ? 0 : conv.unread + 1,
              createdAt: new Date(),
            };
          }
          return conv;
        })
      );
    });

    return () => {
      socket.off("chat-accepted");
      socket.off("receive-message");
    };
  }, [
    activeConversationId,
    inputMessage,
    socket,
    newConversation,
    getCurrentConversation,
    conversations,
    openConversation,
  ]);

  const currentConvo = getCurrentConversation();
  useEffect(() => {
    if (currentView === "chat" && currentConvo?.admin) {
      setChattingWith(currentConvo.admin);
    }
  }, [currentView, currentConvo]);

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="flex flex-row text-left items-center fixed bottom-5 right-3 z-50 bg-stone-50 hover:bg-stone-200 duration-200 transition-all p-2 pl-4 rounded-full shadow-md cursor-pointer"
      >
        <ChevronUp className="text-gray-500 text-sm mr-4" size={16} />
        <div className="text-xs mr-8">
          <p className="font-semibold leading-3">Need to talk?</p>
          <p className="max-w-[10rem] text-gray-500">
            Click here to chat with us!
          </p>
        </div>
        <div className="flex justify-center items-center bg-stone-500 p-2 size-9 text-white rounded-full text-sm">
          <MessageCircle size={16} />
        </div>
      </button>
    );
  }

  if (currentView === "conversations") {
    return (
      <div className="fixed bottom-5 right-3 z-50 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-stone-600 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MessageCircle size={20} />
            <div>
              <h3 className="font-semibold text-sm">Messages</h3>
              <p className="text-xs opacity-90">
                {conversations.length}{" "}
                {conversations.length === 1 ? "conversation" : "conversations"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={createNewConversation}
              className="hover:bg-stone-700 p-1 rounded transition-colors"
              title="New conversation"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={handleClose}
              className="hover:bg-stone-700 p-1 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
              <MessageCircle size={48} className="mb-4 opacity-50" />
              <p className="text-sm text-center">No conversations yet</p>
              <p className="text-xs text-center mt-1">
                Click + to start chatting
              </p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => {
                  openConversation(conversation.id);
                  if (conversation.admin) {
                    const roomId = getRoomId(user!.id, conversation.admin.id);
                    setCurrentRoomId(roomId);
                    socket.emit("join-room", roomId);
                  }
                }}
                className="flex items-center gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                {conversation.admin ? (
                  <Avatar className="cursor-pointer size-12 border">
                    <AvatarImage
                      src={conversation.admin.profilePhoto}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {conversation.admin.firstName[0]}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="flex justify-center items-center bg-stone-100 size-12 rounded-full">
                    <FontAwesomeIcon
                      icon={faMessage}
                      className="text-stone-600 m-4"
                    />
                  </div>
                )}
                <div className="w-full">
                  <div className="flex justify-between items-start mb-0.5">
                    <h4 className="font-medium text-sm text-gray-900 truncate flex-1">
                      {conversation.admin
                        ? `${conversation.admin.firstName} ${conversation.admin.lastName}`
                        : "New Conversation"}
                    </h4>
                    <div className="flex items-center space-x-2 ml-2">
                      {conversation.unread > 0 && (
                        <span className="bg-stone-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 truncate mb-1">
                    {conversation.latestMessage}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatTime(new Date(conversation.createdAt))}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Chat View
  const currentConversation = getCurrentConversation();
  if (!currentConversation) return null;

  return (
    <div className="fixed bottom-5 right-3 z-50 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col overflow-hidden">
      <Toaster />
      {/* Header */}
      <div className="bg-stone-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setCurrentView("conversations");
              setChattingWith(undefined);
            }}
            className="hover:bg-stone-700 p-1 rounded transition-colors mr-1"
          >
            <ArrowLeft size={16} />
          </button>
          {chattingWith && (
            <Avatar className="cursor-pointer">
              <AvatarImage
                src={chattingWith.profilePhoto}
                className="object-cover"
              />
              <AvatarFallback className="text-stone-800">
                {chattingWith.firstName[0]}
              </AvatarFallback>
            </Avatar>
          )}
          <div>
            <h3 className="font-semibold text-sm">
              {chattingWith
                ? `${chattingWith.firstName} ${chattingWith.lastName}`
                : "New Conversation"}
            </h3>
            {chattingWith ? <p className="text-xs opacity-90">Online</p> : null}
          </div>
        </div>
        <button
          onClick={handleClose}
          className="hover:bg-stone-700 p-1 rounded transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      {chattingWith && (
        <p className="text-gray-500 text-xs text-center bg-gray-100 p-2 rounded-md">
          You are chatting with{" "}
          <span className="font-semibold">{chattingWith.firstName}</span>
        </p>
      )}

      {/* Messages */}
      {chattingWith ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {currentConversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" || message.senderId === user?.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  message.sender === "user" || message.senderId === user?.id
                    ? "bg-stone-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none shadow-sm border"
                }`}
              >
                <p>{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-stone-200"
                      : "text-gray-500"
                  }`}
                >
                  {formatMessageTime(new Date(message.createdAt))}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 rounded-lg rounded-bl-none shadow-sm border px-3 py-2 text-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className="flex flex-1 flex-col justify-center items-center overflow-y-auto p-4 space-y-3 bg-gray-50">
          <PulseLoader color="gray" />
          <p className="text-center text-xs text-pretty max-w-[15rem] text-gray-500">
            Thanks for reaching out! Waiting for an admin to join the chat.
          </p>
        </div>
      )}
      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-200">
        <div className="flex space-x-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={!chattingWith}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className={`flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent ${
              !chattingWith ? "bg-gray-200" : ""
            }`}
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-stone-600 hover:bg-stone-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingChatWidget;
