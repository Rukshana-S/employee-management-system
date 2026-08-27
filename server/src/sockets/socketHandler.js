const { Server } = require("socket.io");

let io = null;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const emitEmployeeEvent = (eventType, data) => {
  if (io) {
    io.emit(eventType, data);
    console.log(`[Socket] Emitted ${eventType}:`, data?.id || data);
  }
};

module.exports = {
  initSocket,
  emitEmployeeEvent,
};
