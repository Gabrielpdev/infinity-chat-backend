import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  username: string;
  password: string;
  rooms: { roomId: string; roomName: string }[];
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rooms: [
    {
      roomId: { type: String, required: true },
      roomName: { type: String, required: true },
    },
  ],
});

export const User = mongoose.model<IUser>("User", UserSchema);
