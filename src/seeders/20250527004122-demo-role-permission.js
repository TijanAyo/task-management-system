"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id, title FROM "Roles" WHERE "deletedFlag" = false`
    );

    const [permissions] = await queryInterface.sequelize.query(
      `SELECT id, title FROM "Permissions" WHERE "deletedFlag" = false`
    );

    const adminRole = roles.find((r) => r.title === "admin");
    const userRole = roles.find((r) => r.title === "user");

    const restrictedPermissions = [
      "view-users",
      "view-all-task",
      "delete-user",
      "create-role",
      "assign-role",
    ];

    const rolePermissionsToInsert = [];

    for (const permission of permissions) {
      rolePermissionsToInsert.push({
        roleId: adminRole.id,
        permissionId: permission.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (!restrictedPermissions.includes(permission.title)) {
        rolePermissionsToInsert.push({
          roleId: userRole.id,
          permissionId: permission.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    await queryInterface.bulkInsert(
      "Roles_permission",
      rolePermissionsToInsert
    );
  },

  async down(queryInterface, Sequelize) {
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM "Roles" WHERE title IN ('admin', 'user')`
    );

    const roleIds = roles.map((r) => r.id);
    await queryInterface.bulkDelete("Roles_permission", {
      roleId: {
        [Sequelize.Op.in]: roleIds,
      },
    });
  },
};
