import { Request, Response } from "express";
export const getUserActivityLog = async (req: Request, res: Response) => {
  res.json({ message: "Get user activity log endpoint" });
};