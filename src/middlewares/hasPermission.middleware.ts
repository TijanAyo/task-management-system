import { Request, Response, NextFunction } from "express";
import { AppError } from "../helpers";

export const hasPermission = (permissionString: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as any;

      if (!user || !user.role.permissions) {
        throw AppError.unauthorized(
          "User not authenticated or permissions not found"
        );
      }

      const hasPermission = user.role.permissions
        .map((perm: any) => perm.title)
        .includes(permissionString);

      if (!hasPermission) {
        throw AppError.unauthorized(
          "You don't have permission to perform this action"
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
