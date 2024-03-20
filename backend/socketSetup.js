import { Server } from "socket.io";

function createConnection(server) {
  const io = new Server(server, {
    cors: { origin: "http://192.168.1.15:5500" },
  });

  const users = {};

  io.on("connection", (socket) => {
    socket.on("new-user-joined", (name) => {
      console.log(`new user ${name}`);
      users[socket.id] = name;
      socket.broadcast.emit(`user-joined`, name);
    });

    socket.on("send", (message) => {
      socket.broadcast.emit(`receive`, {
        userName: users[socket.id],
        message: message,
      });
    });

    socket.on("leave-chat", (userName) => {
      delete users[socket.id];
      socket.broadcast.emit(`left`, userName);
    });

    socket.on("disconnect", () => {
      delete users[socket.id];
    });
  });

  return io;
}

export default createConnection;
