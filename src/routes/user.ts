import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { User } from "../models/user";

const userRouter = Router();
const secret = process.env.JWT_SECRET || "your_jwt_secret";

userRouter.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = new User({ username, password: hashPassword });
  await user.save();

  res.status(201).send({
    user,
    token: jwt.sign({ _id: user._id }, secret, { expiresIn: "24h" }),
  });
});

userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  console.log({ user });
  if (!user) {
    return res.status(401).send("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).send("Invalid credentials");
  }

  const token = jwt.sign({ _id: user._id }, secret, { expiresIn: "24h" });
  res.status(200).send({ user, token });
});

export { userRouter };
