import { Router } from "express";
import { userRouter } from "./user";
import { roomRouter } from "./room";
import { messageRouter } from "./message";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use("/users", userRouter);
router.use("/rooms", authenticate, roomRouter);
router.use("/messages", authenticate, messageRouter);

export { router as apiRouter };
