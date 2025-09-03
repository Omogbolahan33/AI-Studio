import { Request, Response } from "express";
export const getAddresses = async (req: Request, res: Response) => {
  res.json({ message: "Get addresses endpoint" });
};
export const addAddress = async (req: Request, res: Response) => {
  res.json({ message: "Add address endpoint" });
};
export const updateAddress = async (req: Request, res: Response) => {
  res.json({ message: "Update address endpoint" });
};
export const deleteAddress = async (req: Request, res: Response) => {
  res.json({ message: "Delete address endpoint" });
};