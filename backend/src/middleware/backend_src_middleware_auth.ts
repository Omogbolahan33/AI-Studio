import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Auth middleware: verifies JWT and attaches user info to req.user
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) return res.sendStatus(403);
    (req as any).user = user;
    next();
  });
}

// Checks if the user is admin (role: 'Admin' or 'Super Admin')
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user || (user.role !== "Admin" && user.role !== "Super Admin")) {
    return res.status(403).json({ message: "Admin privileges required." });
  }
  next();
}