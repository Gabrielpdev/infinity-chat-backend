import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import { apiRouter } from "./routes";
import { handleSocketConnection } from "./socketHandlers";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.DB_URI;
const frontURL = process.env.FRONTEND_URL;

if (!uri) {
  throw new Error("DB_URI environment variable is not set");
}

if (!frontURL) {
  throw new Error("FRONTEND_URL environment variable is not set");
}

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
  })
);
app.use(bodyParser.json());
app.use("/api", apiRouter);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  handleSocketConnection(io, socket);
});

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
