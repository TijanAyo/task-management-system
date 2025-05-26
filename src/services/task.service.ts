import { AppError, AppResponse } from "../helpers";
import { ICreateTaskPayload, IUpdateTaskPayload } from "../helpers/interface";
import { Task, User } from "../models";

export class TaskService {
  async create(userId: number, payload: ICreateTaskPayload) {
    try {
      await Task.create({
        title: payload.title,
        description: payload.description,
        status: payload.status,
        userId: userId,
      });

      return AppResponse("Task created successfully");
    } catch (error) {
      throw error;
    }
  }

  async viewTask(userId: number, page: number, limit: number) {
    try {
      const offset = (page - 1) * limit;

      const { rows: tasks, count: total } = await Task.findAndCountAll({
        where: {
          userId,
          deletedFlag: false,
        },
        attributes: ["id", "title", "description", "status"],
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      const pagination = {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        pageSize: limit,
      };

      return AppResponse("Tasks fetched successfully", {
        tasks,
        ...pagination,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateTask(
    userId: number,
    taskId: number,
    payload: IUpdateTaskPayload
  ) {
    try {
      if (isNaN(Number(taskId))) {
        throw AppError.badRequest("Task ID must be a number");
      }

      const task = await Task.findByPk(taskId, {
        include: {
          model: User,
          attributes: ["id"],
        },
      });

      if (!task || task.deletedFlag === true) {
        throw AppError.notFound("Task not found");
      }

      if (task.userId !== userId) {
        throw AppError.badRequest(
          "Unauthorized: This task does not belong to the user"
        );
      }

      await task.update(payload);
      return AppResponse("Task updated successfully", task);
    } catch (error) {
      throw error;
    }
  }

  async deleteTask(userId: number, taskId: number) {
    try {
      if (isNaN(Number(taskId))) {
        throw AppError.badRequest("Task ID must be a number");
      }

      const task = await Task.findByPk(taskId, {
        include: {
          model: User,
          attributes: ["id"],
        },
      });

      if (!task || task.deletedFlag === true) {
        throw AppError.notFound("Task not found");
      }

      if (task.userId !== userId) {
        throw AppError.badRequest(
          "Unauthorized: This task does not belong to the user"
        );
      }

      task.update({ deletedFlag: true }); // soft delete

      return AppResponse("Task deleted successfully");
    } catch (error) {
      throw error;
    }
  }

  async generateTimeReport() {
    try {
      // logic goes here
    } catch (error) {
      throw error;
    }
    // this should get the total time spent across all task by the authenticate user
  }

  async generateCompletionReport(userId: number) {
    try {
      const tasks = await Task.findAll({
        where: {
          userId,
          deletedFlag: false,
        },
        attributes: ["status"],
      });

      const total = tasks.length;
      const counts = {
        pending: 0,
        inProgress: 0,
        completed: 0,
      };

      if (total === 0) {
        return AppResponse("No task available", counts);
      }

      tasks.forEach((task) => {
        if (task.status === "pending") counts.pending += 1;
        if (task.status === "in-progress") counts.inProgress += 1;
        if (task.status === "completed") counts.completed += 1;
      });

      const report = {
        pending: `${((counts.pending / total) * 100).toFixed(2)}%`,
        inProgress: `${((counts.inProgress / total) * 100).toFixed(2)}%`,
        completed: `${((counts.completed / total) * 100).toFixed(2)}%`,
      };

      return AppResponse("Completions report generated successfully", {
        totalNumberOfTask: total,
        ...report,
      });
    } catch (error) {
      throw error;
    }
  }
}
