import { Request, Response } from "express";
export const getAllFlags = async (req: Request, res: Response) => {
  res.json({ message: "Get all flags endpoint" });
};
export const getAllActivityLogs = async (req: Request, res: Response) => {
  res.json({ message: "Get all activity logs endpoint" });
};
export const getAllUsers = async (req: Request, res: Response) => {
  res.json({ message: "Get all users (admin) endpoint" });
};
export const getAllTransactions = async (req: Request, res: Response) => {
  res.json({ message: "Get all transactions (admin) endpoint" });
};