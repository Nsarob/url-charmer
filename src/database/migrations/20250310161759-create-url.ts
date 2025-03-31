"use strict";
import { QueryInterface, DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    /**
     * Add altering commands here.
     */
    await queryInterface.createTable("URLs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: "",
      },
      long_url: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      short_code: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      clicks: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
    // Add index on short_code column
    await queryInterface.addIndex("URLs", ["short_code"], {
      name: "idx_short_code",
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    // Remove index on short_code column
    await queryInterface.removeIndex("URLs", "idx_short_code");
    /**
     * Add reverting commands here.
     */
    await queryInterface.dropTable("URLs");
  }
};
