import { NextFunction, Request, Response } from "express";
import { TaskService } from "../services";

const taskService = new TaskService();

export class TaskController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const payload = req.body;
      const result = await taskService.create(userId, payload);
      return res.status(201).json(result);
    } catch (err) {
      return next(err);
    }
  }

  async viewTask(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { page = 1, limit = 10 } = req.query;
      const result = await taskService.viewTask(
        userId,
        Number(page),
        Number(limit)
      );
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  }

  async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const payload = req.body;
      const taskId = req.params.taskId;

      const result = await taskService.updateTask(
        userId,
        Number(taskId),
        payload
      );
      return res.status(201).json(result);
    } catch (err) {
      return next(err);
    }
  }

  async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const taskId = req.params.taskId;

      const result = await taskService.deleteTask(userId, Number(taskId));
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  }

  async generateTimeReport(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await taskService.generateTimeReport(Number(userId));
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  }

  async generateCompletionReport(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.id;
      const result = await taskService.generateCompletionReport(Number(userId));
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  }
}
