import { NextFunction, Request, Response } from "express";
import { AdminService } from "../services";

const adminService = new AdminService();

export class AdminController {
  async viewAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await adminService.viewAllUsers(
        Number(page),
        Number(limit)
      );
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  }

  async viewAllTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await adminService.viewAllTasks(
        Number(page),
        Number(limit)
      );
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  }
}
