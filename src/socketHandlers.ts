import { Server, Socket } from "socket.io";
import { Message } from "./models/message";
import { User } from "./models/user";

export function handleSocketConnection(io: Server, socket: Socket) {
  console.log("A user connected");

  socket.on("joinRoom", async ({ roomId, roomName, username }) => {
    console.log(`${username} joined room: `, roomId, roomName);

    socket.join(roomId);

    const user = await User.findOneAndUpdate(
      { username },
      { $addToSet: { rooms: { roomId, roomName } } },
      { new: true, upsert: true }
    );

    socket.to(roomId).emit("userJoined", user.username);

    const roomUsers = await User.find({ "rooms.roomId": roomId }).select(
      "username -_id"
    );
    io.to(roomId).emit(
      "roomUsers",
      roomUsers.map((u) => u.username)
    );
  });

  socket.on("sendMessage", async (socketMsg) => {
    console.log("New message: ", socketMsg);
    const message = new Message(socketMsg);
    await message.save();
    io.to(socketMsg.roomId).emit("newMessage", message);
  });

  socket.on("leaveRoom", async ({ roomId, username }) => {
    try {
      console.log("[socket]", "leave room :", roomId);

      socket.leave(roomId);

      const user = await User.findOneAndUpdate(
        { username },
        { $pull: { rooms: { roomId } } },
        { new: true }
      );

      socket.data.rooms = user?.rooms;
      socket.to(roomId).emit("userLeft", username);

      const roomUsers = await User.find({ "rooms.roomId": roomId }).select(
        "username -_id"
      );
      io.to(roomId).emit(
        "roomUsers",
        roomUsers.map((u) => u.username)
      );
    } catch (e) {
      console.log("[error]", "leave room :", e);
      socket.emit("error", "couldnt perform requested action");
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("getUserRooms", async (username) => {
    const user = await User.findOne({ username });

    socket.emit("userRooms", user ? user.rooms : []);
  });

  socket.on("getRoomUsers", async (roomId, callback) => {
    const roomUsers = await User.find({ "rooms.roomId": roomId }).select(
      "username -_id"
    );
    callback(roomUsers.map((u) => u.username));
  });
}
