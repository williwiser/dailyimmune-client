import { io } from "socket.io-client";

const SocketTest = () => {
  const socket = io("http://localhost:3000", { withCredentials: true });
  socket.emit("register", "hello"); // Send auth token once connected
  return <div>SocketTest</div>;
};

export default SocketTest;
