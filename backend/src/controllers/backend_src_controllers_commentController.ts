import { Request, Response } from "express";

export const addComment = async (req: Request, res: Response) => {
  res.json({ message: "Add comment endpoint" });
};
export const editComment = async (req: Request, res: Response) => {
  res.json({ message: "Edit comment endpoint" });
};
export const deleteComment = async (req: Request, res: Response) => {
  res.json({ message: "Delete comment endpoint" });
};
export const flagComment = async (req: Request, res: Response) => {
  res.json({ message: "Flag comment endpoint" });
};
export const unflagComment = async (req: Request, res: Response) => {
  res.json({ message: "Unflag comment endpoint" });
};
export const resolveFlag = async (req: Request, res: Response) => {
  res.json({ message: "Resolve comment flag endpoint" });
};