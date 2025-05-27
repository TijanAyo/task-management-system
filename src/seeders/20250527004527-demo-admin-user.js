"use strict";

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM "Roles" WHERE title = 'admin'`
    );

    const adminRole = roles[0];

    if (!adminRole) {
      throw new Error("Admin role not found");
    }

    const hashedPassword = await bcrypt.hash("Password123", 10);

    await queryInterface.bulkInsert("Users", [
      {
        email: "admin@example.com",
        password: hashedPassword,
        deletedFlag: false,
        roleId: adminRole.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", {
      email: "admin@example.com",
    });
  },
};
