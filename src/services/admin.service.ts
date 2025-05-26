import { User, Task } from "../models";
import { AppResponse } from "../helpers";

export class AdminService {
  async viewAllUsers(page: number, limit: number) {
    try {
      const offset = (page - 1) * limit;

      const { count, rows: users } = await User.findAndCountAll({
        offset,
        limit,
        attributes: ["id", "email", "createdAt"],
        order: [["createdAt", "DESC"]],
      });

      return AppResponse("Users fetched successfully", {
        users,
        total: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
      });
    } catch (error) {
      throw error;
    }
  }

  async viewAllTasks(page: number, limit: number) {
    try {
      const offset = (page - 1) * limit;

      const { count, rows: tasks } = await Task.findAndCountAll({
        offset,
        limit,
        attributes: ["id", "title", "status", "userId", "createdAt"],
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: User,
            attributes: ["id", "email"],
          },
        ],
      });

      return AppResponse("Tasks fetched successfully", {
        tasks,
        total: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
      });
    } catch (error) {
      throw error;
    }
  }
}
