import { Request, Response } from "express";
export const getNotifications = async (req: Request, res: Response) => {
  res.json({ message: "Get notifications endpoint" });
};
export const markAsRead = async (req: Request, res: Response) => {
  res.json({ message: "Mark notification as read endpoint" });
};
export const markAsUnread = async (req: Request, res: Response) => {
  res.json({ message: "Mark notification as unread endpoint" });
};
export const deleteNotification = async (req: Request, res: Response) => {
  res.json({ message: "Delete notification endpoint" });
};