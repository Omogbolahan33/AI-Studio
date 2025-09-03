import { Request, Response } from "express";
export const getDisputes = async (req: Request, res: Response) => {
  res.json({ message: "Get disputes endpoint" });
};
export const createDispute = async (req: Request, res: Response) => {
  res.json({ message: "Create dispute endpoint" });
};
export const getDisputeById = async (req: Request, res: Response) => {
  res.json({ message: "Get dispute by ID endpoint" });
};
export const updateDispute = async (req: Request, res: Response) => {
  res.json({ message: "Update dispute endpoint" });
};
export const addMessage = async (req: Request, res: Response) => {
  res.json({ message: "Add dispute message endpoint" });
};
export const resolveDispute = async (req: Request, res: Response) => {
  res.json({ message: "Resolve dispute endpoint" });
};