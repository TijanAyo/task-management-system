"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Roles", [
      {
        title: "admin",
        deletedFlag: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "user",
        deletedFlag: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Roles", {
      title: ["admin", "user"],
    });
  },
};
