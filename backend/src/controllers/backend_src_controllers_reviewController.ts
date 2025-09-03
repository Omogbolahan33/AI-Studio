import { Request, Response } from "express";
export const getUserReviews = async (req: Request, res: Response) => {
  res.json({ message: "Get user reviews endpoint" });
};
export const addReview = async (req: Request, res: Response) => {
  res.json({ message: "Add review endpoint" });
};