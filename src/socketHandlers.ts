import { Server, Socket } from "socket.io";
import { Message } from "./models/message";
import { User } from "./models/user";
import { Room } from "./models/room";

async function handleCreateRoom(
  socket: Socket,
  io: Server,
  data: { name: string }
) {
  const { name } = data;

  const room = new Room({ name });
  await room.save();

  io.sockets.emit("newRoom", room);
}

async function handleJoinRoom(
  socket: Socket,
  io: Server,
  {
    roomId,
    roomName,
    username,
  }: {
    username: string;
    roomId: string;
    roomName: string;
  }
) {
  console.log(`${username} joined room: `, roomId, roomName);

  socket.join(roomId);

  const user = await User.findOneAndUpdate(
    { username },
    { $addToSet: { rooms: { roomId, roomName } } },
    { new: true, upsert: true }
  );

  socket.to(roomId).emit("userJoined", user.username);
}

async function handleSendMessage(
  io: Server,
  socketMsg: {
    username: string;
    text: string;
    roomId: string;
  }
) {
  const message = new Message(socketMsg);
  await message.save();
  console.log("new message: ", message);
  io.to(socketMsg.roomId).emit("newMessage", message);
}

async function handleEditMessage(
  io: Server,
  {
    messageId,
    newText,
  }: {
    messageId: string;
    newText: string;
  }
) {
  const updatedMessage = await Message.findByIdAndUpdate(
    messageId,
    { text: newText },
    { new: true }
  );
  io.to(updatedMessage.roomId).emit("messageEdited", updatedMessage);
}

async function handleRemoveMessage(
  io: Server,
  {
    messageId,
  }: {
    messageId: string;
  }
) {
  const removedMessage = await Message.findByIdAndDelete(messageId);
  io.to(removedMessage.roomId).emit("messageRemoved", messageId);
}

async function handleLeaveRoom(
  socket: Socket,
  io: Server,
  {
    roomId,
    username,
  }: {
    roomId: string;
    username: string;
  }
) {
  console.log(`${username} leave room: `, roomId);

  socket.leave(roomId);

  await User.findOneAndUpdate(
    { username },
    { $pull: { rooms: { roomId } } },
    { new: true }
  );

  socket.to(roomId).emit("userLeft", username);
}

async function handleGetRoomUsers(
  roomId: string,
  callback: (roomUsers: string[]) => void
) {
  const roomUsers = await User.find({ "rooms.roomId": roomId }).select(
    "username -_id"
  );
  callback(roomUsers.map((u) => u.username));
}

async function handleSubscribeOnMyRooms(
  socket: Socket,
  io: Server,
  data: { username: string }
) {
  const user = await User.findOne({ username: data.username });

  if (!user) {
    return;
  }

  user.rooms.forEach((room) => {
    socket.join(room.roomId);
  });

  console.log(`${data.username} subscribed on his rooms`);
}

export function handleSocketConnection(io: Server, socket: Socket) {
  console.log("A user connected");

  socket.on("sendMessage", (data) => handleSendMessage(io, data));
  socket.on("editMessage", (data) => handleEditMessage(io, data));
  socket.on("removeMessage", (data) => handleRemoveMessage(io, data));

  socket.on("createRoom", (data) => handleCreateRoom(socket, io, data));
  socket.on("joinRoom", (data) => handleJoinRoom(socket, io, data));
  socket.on("leaveRoom", (data) => handleLeaveRoom(socket, io, data));
  socket.on("getRoomUsers", (roomId, callback) =>
    handleGetRoomUsers(roomId, callback)
  );

  socket.on("subscribeOnMyRooms", (data) =>
    handleSubscribeOnMyRooms(socket, io, data)
  );

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
}
