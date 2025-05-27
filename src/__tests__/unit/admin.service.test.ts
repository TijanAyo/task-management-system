import { AdminService } from "../../services/admin.service";
import { User, Task } from "../../models";
import { AppResponse } from "../../helpers";

jest.mock("../../models", () => ({
  User: {
    findAndCountAll: jest.fn(),
  },
  Task: {
    findAndCountAll: jest.fn(),
  },
}));

describe("AdminService", () => {
  let adminService: AdminService;

  beforeEach(() => {
    adminService = new AdminService();
    jest.clearAllMocks();
  });

  describe("viewAllUsers", () => {
    const mockUsers = [
      {
        id: 1,
        email: "user1@example.com",
        createdAt: new Date(),
      },
      {
        id: 2,
        email: "user2@example.com",
        createdAt: new Date(),
      },
    ];

    it("should return paginated users successfully", async () => {
      (User.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 2,
        rows: mockUsers,
      });

      const result = await adminService.viewAllUsers(1, 10);

      expect(result).toEqual(
        AppResponse("Users fetched successfully", {
          users: mockUsers,
          total: 2,
          currentPage: 1,
          totalPages: 1,
        })
      );

      expect(User.findAndCountAll).toHaveBeenCalledWith({
        offset: 0,
        limit: 10,
        attributes: ["id", "email", "createdAt"],
        order: [["createdAt", "DESC"]],
      });
    });

    it("should handle empty user list", async () => {
      (User.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 0,
        rows: [],
      });

      const result = await adminService.viewAllUsers(1, 10);

      expect(result).toEqual(
        AppResponse("Users fetched successfully", {
          users: [],
          total: 0,
          currentPage: 1,
          totalPages: 0,
        })
      );
    });

    it("should handle pagination correctly", async () => {
      (User.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 15,
        rows: mockUsers,
      });

      const result = await adminService.viewAllUsers(2, 10);

      expect(result).toEqual(
        AppResponse("Users fetched successfully", {
          users: mockUsers,
          total: 15,
          currentPage: 2,
          totalPages: 2,
        })
      );

      expect(User.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          offset: 10,
          limit: 10,
        })
      );
    });
  });

  describe("viewAllTasks", () => {
    const mockTasks = [
      {
        id: 1,
        title: "Task 1",
        status: "completed",
        userId: 1,
        createdAt: new Date(),
        User: {
          id: 1,
          email: "user1@example.com",
        },
      },
      {
        id: 2,
        title: "Task 2",
        status: "pending",
        userId: 2,
        createdAt: new Date(),
        User: {
          id: 2,
          email: "user2@example.com",
        },
      },
    ];

    it("should return paginated tasks successfully", async () => {
      (Task.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 2,
        rows: mockTasks,
      });

      const result = await adminService.viewAllTasks(1, 10);

      expect(result).toEqual(
        AppResponse("Tasks fetched successfully", {
          tasks: mockTasks,
          total: 2,
          currentPage: 1,
          totalPages: 1,
        })
      );

      expect(Task.findAndCountAll).toHaveBeenCalledWith({
        offset: 0,
        limit: 10,
        attributes: ["id", "title", "status", "userId", "createdAt"],
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: User,
            attributes: ["id", "email"],
          },
        ],
      });
    });

    it("should handle empty task list", async () => {
      (Task.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 0,
        rows: [],
      });

      const result = await adminService.viewAllTasks(1, 10);

      expect(result).toEqual(
        AppResponse("Tasks fetched successfully", {
          tasks: [],
          total: 0,
          currentPage: 1,
          totalPages: 0,
        })
      );
    });

    it("should handle pagination correctly", async () => {
      (Task.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 15,
        rows: mockTasks,
      });

      const result = await adminService.viewAllTasks(2, 10);

      expect(result).toEqual(
        AppResponse("Tasks fetched successfully", {
          tasks: mockTasks,
          total: 15,
          currentPage: 2,
          totalPages: 2,
        })
      );

      expect(Task.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          offset: 10,
          limit: 10,
        })
      );
    });
  });
});
