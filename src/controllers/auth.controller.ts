import { AuthService } from "../services";
import { NextFunction, Request, Response } from "express";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const result = await authService.register(payload);
      res.status(201).json(result);
    } catch (err) {
      return next(err);
    }
  }

  async login(req: Request, res: Response) {
    // const payload = req.body;
    // const result = await authService.login(payload);
    // res.status(200).json(result);
  }
}
