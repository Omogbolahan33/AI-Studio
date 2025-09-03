import { Request, Response } from "express";
export const getCategories = async (_req: Request, res: Response) => {
  res.json({ message: "Get categories endpoint" });
};
export const createCategory = async (req: Request, res: Response) => {
  res.json({ message: "Create category endpoint" });
};
export const updateCategory = async (req: Request, res: Response) => {
  res.json({ message: "Update category endpoint" });
};
export const deleteCategory = async (req: Request, res: Response) => {
  res.json({ message: "Delete category endpoint" });
};