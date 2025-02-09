import { Router } from "express";
import { Message } from "../models/message";

const messageRouter = Router();

messageRouter.get("/:roomId", async (req, res) => {
  const { roomId } = req.params;
  const messages = await Message.find({ roomId });
  res.status(200).send(messages);
});

export { messageRouter };
