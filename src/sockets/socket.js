let ioInstance;

export const initializeSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
};

export const emitToAll = (event, payload) => {
  if (ioInstance) {
    ioInstance.emit(event, payload);
  }
};
