import { Request, Response } from "express";
export const getBankAccounts = async (req: Request, res: Response) => {
  res.json({ message: "Get bank accounts endpoint" });
};
export const addBankAccount = async (req: Request, res: Response) => {
  res.json({ message: "Add bank account endpoint" });
};
export const updateBankAccount = async (req: Request, res: Response) => {
  res.json({ message: "Update bank account endpoint" });
};
export const deleteBankAccount = async (req: Request, res: Response) => {
  res.json({ message: "Delete bank account endpoint" });
};