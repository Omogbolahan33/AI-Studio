import { Request, Response } from "express";

export const getPosts = async (req: Request, res: Response) => {
  res.json({ message: "Get posts endpoint" });
};
export const createPost = async (req: Request, res: Response) => {
  res.json({ message: "Create post endpoint" });
};
export const getPostById = async (req: Request, res: Response) => {
  res.json({ message: "Get post by ID endpoint" });
};
export const updatePost = async (req: Request, res: Response) => {
  res.json({ message: "Update post endpoint" });
};
export const deletePost = async (req: Request, res: Response) => {
  res.json({ message: "Delete post endpoint" });
};
export const likePost = async (req: Request, res: Response) => {
  res.json({ message: "Like post endpoint" });
};
export const dislikePost = async (req: Request, res: Response) => {
  res.json({ message: "Dislike post endpoint" });
};
export const pinPost = async (req: Request, res: Response) => {
  res.json({ message: "Pin post endpoint" });
};
export const unpinPost = async (req: Request, res: Response) => {
  res.json({ message: "Unpin post endpoint" });
};
export const flagPost = async (req: Request, res: Response) => {
  res.json({ message: "Flag post endpoint" });
};
export const unflagPost = async (req: Request, res: Response) => {
  res.json({ message: "Unflag post endpoint" });
};
export const resolveFlag = async (req: Request, res: Response) => {
  res.json({ message: "Resolve post flag endpoint" });
};