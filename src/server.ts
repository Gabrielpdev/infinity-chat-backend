import express from "express";
import path from "path";
import { messageRouter } from "./routes/message";
import { roomRouter } from "./routes/room";
import { handleSocketConnection } from "./socketHandlers";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());

app.use("/api/messages", messageRouter);
app.use("/api/rooms", roomRouter);

io.on("connection", (socket) => {
  handleSocketConnection(io, socket);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
