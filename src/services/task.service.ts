import { Op } from "sequelize";
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
      const updatePayload: any = { ...payload };

      if (payload.status === "in-progress" && !task.startTime) {
        updatePayload.startTime = new Date();
      }

      if (payload.status === "completed") {
        if (!task.startTime) {
          throw AppError.badRequest(
            "Cannot mark task as completed before it has been started"
          );
        }

        if (!task.endTime) {
          updatePayload.endTime = new Date();
        }
      }

      await task.update(updatePayload);

      const { deletedFlag, createdAt, updatedAt, user, ...sanitizedTask } =
        task.toJSON();

      return AppResponse("Task updated successfully", sanitizedTask);
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

  async generateTimeReport(userId: number) {
    try {
      const tasks = await Task.findAll({
        where: {
          userId,
          deletedFlag: false,
          startTime: { [Op.not]: null },
          endTime: { [Op.not]: null },
        },
      });

      if (tasks.length === 0) {
        return AppResponse("No completed tasks found", { totalMinutes: 0 });
      }

      let totalMinutes = 0;

      tasks.forEach((task) => {
        const start = new Date(task.startTime!);
        const end = new Date(task.endTime!);
        const durationMs = end.getTime() - start.getTime();
        const taskMinutes = durationMs / (1000 * 60);
        totalMinutes += taskMinutes;
      });

      return AppResponse("Total time spent on tasks calculated successfully", {
        totalMinutes: Number(totalMinutes.toFixed(2)),
        totalHours: (totalMinutes / 60).toFixed(2),
      });
    } catch (error) {
      console.error("Error in generateTimeReport:", error);
      throw error;
    }
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
