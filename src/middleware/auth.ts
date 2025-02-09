import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

const secret = process.env.JWT_SECRET || "your_jwt_secret";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, secret) as { _id: string };
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).send("Invalid token.");
    }

    (req as any).user = user;
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
};
