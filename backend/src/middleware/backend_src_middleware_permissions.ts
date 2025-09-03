import { Request, Response, NextFunction } from "express";

// Example: Middleware to check if user is owner of resource (to be customized as needed)
export function isOwnerOrAdmin(model: any, paramIdField = "id") {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const resource = await model.findByPk(req.params[paramIdField]);
    if (!resource) return res.status(404).json({ message: "Resource not found." });
    if (resource.userId !== user.id && user.role !== "Admin" && user.role !== "Super Admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}