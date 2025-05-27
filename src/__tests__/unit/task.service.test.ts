import { TaskService } from "../../services/task.service";
import { Task, User } from "../../models";
import { AppError, AppResponse } from "../../helpers";
import { Op } from "sequelize";

jest.mock("../../models", () => ({
  Task: {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
  },
  User: {
    findOne: jest.fn(),
  },
}));

describe("TaskService", () => {
  let taskService: TaskService;
  const mockUserId = 1;

  beforeEach(() => {
    taskService = new TaskService();
    jest.clearAllMocks();
  });

  describe("create", () => {
    const mockCreatePayload = {
      title: "Test Task",
      description: "Test Description",
      status: "pending",
    };

    it("should create a task successfully", async () => {
      (Task.create as jest.Mock).mockResolvedValue({ id: 1 });

      const result = await taskService.create(mockUserId, mockCreatePayload);

      expect(result).toEqual(AppResponse("Task created successfully"));
      expect(Task.create).toHaveBeenCalledWith({
        title: mockCreatePayload.title,
        description: mockCreatePayload.description,
        status: mockCreatePayload.status,
        userId: mockUserId,
      });
    });

    it("should handle creation error", async () => {
      const error = new Error("Database error");
      (Task.create as jest.Mock).mockRejectedValue(error);

      await expect(
        taskService.create(mockUserId, mockCreatePayload)
      ).rejects.toThrow(error);
    });
  });

  describe("viewTask", () => {
    const mockTasks = [
      {
        id: 1,
        title: "Task 1",
        description: "Description 1",
        status: "pending",
      },
      {
        id: 2,
        title: "Task 2",
        description: "Description 2",
        status: "completed",
      },
    ];

    it("should return paginated tasks successfully", async () => {
      (Task.findAndCountAll as jest.Mock).mockResolvedValue({
        rows: mockTasks,
        count: 2,
      });

      const result = await taskService.viewTask(mockUserId, 1, 10);

      expect(result).toEqual(
        AppResponse("Tasks fetched successfully", {
          tasks: mockTasks,
          total: 2,
          currentPage: 1,
          totalPages: 1,
          pageSize: 10,
        })
      );

      expect(Task.findAndCountAll).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          deletedFlag: false,
        },
        attributes: ["id", "title", "description", "status"],
        limit: 10,
        offset: 0,
        order: [["createdAt", "DESC"]],
      });
    });

    it("should handle empty task list", async () => {
      (Task.findAndCountAll as jest.Mock).mockResolvedValue({
        rows: [],
        count: 0,
      });

      const result = await taskService.viewTask(mockUserId, 1, 10);

      expect(result).toEqual(
        AppResponse("Tasks fetched successfully", {
          tasks: [],
          total: 0,
          currentPage: 1,
          totalPages: 0,
          pageSize: 10,
        })
      );
    });
  });

  describe("updateTask", () => {
    const mockTaskId = 1;
    const mockUpdatePayload = {
      title: "Updated Task",
      status: "in-progress",
    };

    const mockTask = {
      id: mockTaskId,
      userId: mockUserId,
      title: "Original Task",
      status: "pending",
      startTime: null,
      endTime: null,
      update: jest.fn(),
      toJSON: jest.fn().mockReturnValue({
        id: mockTaskId,
        userId: mockUserId,
        title: "Updated Task",
        status: "in-progress",
        startTime: new Date(),
        endTime: null,
        deletedFlag: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { id: 1 },
      }),
    };

    it("should update task successfully", async () => {
      (Task.findByPk as jest.Mock).mockResolvedValue(mockTask);
      mockTask.update.mockResolvedValue(mockTask);

      const result = await taskService.updateTask(
        mockUserId,
        mockTaskId,
        mockUpdatePayload
      );

      expect(result).toEqual(
        AppResponse("Task updated successfully", {
          id: mockTaskId,
          userId: mockUserId,
          title: "Updated Task",
          status: "in-progress",
          startTime: expect.any(Date),
          endTime: null,
        })
      );
    });

    it("should throw error if task not found", async () => {
      (Task.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(
        taskService.updateTask(mockUserId, mockTaskId, mockUpdatePayload)
      ).rejects.toThrow(AppError.notFound("Task not found"));
    });

    it("should throw error if task belongs to different user", async () => {
      (Task.findByPk as jest.Mock).mockResolvedValue({
        ...mockTask,
        userId: 999,
      });

      await expect(
        taskService.updateTask(mockUserId, mockTaskId, mockUpdatePayload)
      ).rejects.toThrow(
        AppError.badRequest(
          "Unauthorized: This task does not belong to the user"
        )
      );
    });

    it("should set startTime when status changes to in-progress", async () => {
      const taskWithNoStartTime = {
        ...mockTask,
        startTime: null,
      };
      (Task.findByPk as jest.Mock).mockResolvedValue(taskWithNoStartTime);
      taskWithNoStartTime.update.mockResolvedValue(taskWithNoStartTime);

      await taskService.updateTask(mockUserId, mockTaskId, {
        status: "in-progress",
      });

      expect(taskWithNoStartTime.update).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "in-progress",
          startTime: expect.any(Date),
        })
      );
    });

    it("should throw error if trying to complete task without start time", async () => {
      const taskWithNoStartTime = {
        ...mockTask,
        startTime: null,
      };
      (Task.findByPk as jest.Mock).mockResolvedValue(taskWithNoStartTime);

      await expect(
        taskService.updateTask(mockUserId, mockTaskId, { status: "completed" })
      ).rejects.toThrow(
        AppError.badRequest(
          "Cannot mark task as completed before it has been started"
        )
      );
    });
  });

  describe("deleteTask", () => {
    const mockTaskId = 1;
    const mockTask = {
      id: mockTaskId,
      userId: mockUserId,
      deletedFlag: false,
      update: jest.fn(),
    };

    it("should soft delete task successfully", async () => {
      (Task.findByPk as jest.Mock).mockResolvedValue(mockTask);
      mockTask.update.mockResolvedValue(mockTask);

      const result = await taskService.deleteTask(mockUserId, mockTaskId);

      expect(result).toEqual(AppResponse("Task deleted successfully"));
      expect(mockTask.update).toHaveBeenCalledWith({ deletedFlag: true });
    });

    it("should throw error if task not found", async () => {
      (Task.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(
        taskService.deleteTask(mockUserId, mockTaskId)
      ).rejects.toThrow(AppError.notFound("Task not found"));
    });

    it("should throw error if task already deleted", async () => {
      (Task.findByPk as jest.Mock).mockResolvedValue({
        ...mockTask,
        deletedFlag: true,
      });

      await expect(
        taskService.deleteTask(mockUserId, mockTaskId)
      ).rejects.toThrow(AppError.notFound("Task not found"));
    });
  });

  describe("generateTimeReport", () => {
    const mockTasks = [
      {
        id: 1,
        startTime: new Date("2024-01-01T10:00:00Z"),
        endTime: new Date("2024-01-01T10:30:00Z"),
      },
      {
        id: 2,
        startTime: new Date("2024-01-01T11:00:00Z"),
        endTime: new Date("2024-01-01T11:45:00Z"),
      },
    ];

    it("should calculate total time correctly", async () => {
      (Task.findAll as jest.Mock).mockResolvedValue(mockTasks);

      const result = await taskService.generateTimeReport(mockUserId);

      expect(result).toEqual(
        AppResponse("Total time spent on tasks calculated successfully", {
          totalMinutes: 75,
          totalHours: "1.25",
        })
      );

      expect(Task.findAll).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          deletedFlag: false,
          startTime: { [Op.not]: null },
          endTime: { [Op.not]: null },
        },
      });
    });

    it("should return zero for no completed tasks", async () => {
      (Task.findAll as jest.Mock).mockResolvedValue([]);

      const result = await taskService.generateTimeReport(mockUserId);

      expect(result).toEqual(
        AppResponse("No completed tasks found", { totalMinutes: 0 })
      );
    });
  });

  describe("generateCompletionReport", () => {
    const mockTasks = [
      { status: "pending" },
      { status: "pending" },
      { status: "in-progress" },
      { status: "completed" },
      { status: "completed" },
    ];

    it("should generate completion report correctly", async () => {
      (Task.findAll as jest.Mock).mockResolvedValue(mockTasks);

      const result = await taskService.generateCompletionReport(mockUserId);

      expect(result).toEqual(
        AppResponse("Completions report generated successfully", {
          totalNumberOfTask: 5,
          pending: "40.00%",
          inProgress: "20.00%",
          completed: "40.00%",
        })
      );

      expect(Task.findAll).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          deletedFlag: false,
        },
        attributes: ["status"],
      });
    });

    it("should handle empty task list", async () => {
      (Task.findAll as jest.Mock).mockResolvedValue([]);

      const result = await taskService.generateCompletionReport(mockUserId);

      expect(result).toEqual(
        AppResponse("No task available", {
          pending: 0,
          inProgress: 0,
          completed: 0,
        })
      );
    });
  });
});
