import { Request, Response } from "express";
export const uploadMedia = async (req: Request, res: Response) => {
  res.json({ message: "Upload media endpoint" });
};