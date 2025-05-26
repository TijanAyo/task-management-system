"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Tasks", "startTime", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("Tasks", "endTime", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Tasks", "startTime");
    await queryInterface.removeColumn("Tasks", "endTime");
  },
};
