"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert("Permissions", [
      {
        title: "view-task",
        description: "Can view their own tasks",
        deletedFlag: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "create-task",
        description: "Can create new tasks",
        deletedFlag: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "update-task",
        description: "Can update their own tasks",
        deletedFlag: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "delete-task",
        description: "Can delete their own tasks",
        deletedFlag: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "view-users",
        description: "Can view the list of all users",
        deletedFlag: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "view-all-task",
        description: "Can view all users tasks",
        deletedFlag: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "delete-user",
        description: "Can delete a user account",
        deletedFlag: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "create-role",
        description: "Can create new roles",
        deletedFlag: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "assign-role",
        description: "Can assign roles to users",
        deletedFlag: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "generate-report-time",
        description: "Can generate task report time",
        deletedFlag: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "generate-completion-report",
        description: "Can generate task completion time",
        deletedFlag: false,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Permissions", {
      title: [
        "view-task",
        "create-task",
        "update-task",
        "delete-task",
        "view-users",
        "view-all-task",
        "delete-user",
        "create-role",
        "assign-role",
        "generate-report-time",
        "generate-completion-report",
      ],
    });
  },
};
