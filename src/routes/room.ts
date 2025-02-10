import { Router } from "express";
import { Room } from "../models/room";
import { User } from "../models/user";

const roomRouter = Router();

roomRouter.get("/list", async (req, res) => {
  const rooms = await Room.find();
  res.status(200).send(rooms);
});

roomRouter.get("/myrooms", async (req, res) => {
  if (!req.user) return res.status(401).send({ error: "Invalid token" });

  const user = await User.findOne({ username: req.user.username });
  res.status(200).send(user ? user.rooms : []);
});

export { roomRouter };
