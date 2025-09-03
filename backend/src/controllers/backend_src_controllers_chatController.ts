import { Request, Response } from "express";
export const getChats = async (req: Request, res: Response) => {
  res.json({ message: "Get chats endpoint" });
};
export const createChat = async (req: Request, res: Response) => {
  res.json({ message: "Create chat endpoint" });
};
export const getChatById = async (req: Request, res: Response) => {
  res.json({ message: "Get chat by ID endpoint" });
};
export const sendMessage = async (req: Request, res: Response) => {
  res.json({ message: "Send message endpoint" });
};
export const forwardMessage = async (req: Request, res: Response) => {
  res.json({ message: "Forward message endpoint" });
};
export const saveSticker = async (req: Request, res: Response) => {
  res.json({ message: "Save sticker endpoint" });
};