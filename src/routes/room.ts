import { Router } from "express";
import { Room } from "../models/room";

const roomRouter = Router();

roomRouter.post("/create", async (req, res) => {
  const { name } = req.body;
  const room = new Room({ name });
  await room.save();
  res.status(201).send(room);
});

roomRouter.get("/list", async (req, res) => {
  const rooms = await Room.find();

  res.status(200).send(rooms);
});

export { roomRouter };
