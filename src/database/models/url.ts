import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
} from "sequelize";

import User from "./user";
import connection from "../connection";


class URL extends Model<InferAttributes<URL>, InferCreationAttributes<URL>> {
  declare id: CreationOptional<number>;
  declare user_id: ForeignKey<User["id"]>;
  declare title: string;
  declare short_code: string;
  declare long_url: string;
  declare clicks?: number;

  declare readonly user: NonAttribute<User>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

URL.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.NUMBER,
    },
    user_id: {
      allowNull: false,
      type: DataTypes.NUMBER,
      references: {
        model: User,
        key: "id",
      },
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
      type: DataTypes.NUMBER,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: connection,
    modelName: "URL",
    tableName: "URLs",
  }
);


export default URL;
