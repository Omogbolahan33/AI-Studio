import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";

export interface ActivityLogAttributes {
  id: number;
  userId: number;
  action: string;
  details: string;
  timestamp: Date;
}

interface ActivityLogCreationAttributes extends Optional<ActivityLogAttributes, "id"> {}

export class ActivityLog extends Model<ActivityLogAttributes, ActivityLogCreationAttributes> implements ActivityLogAttributes {
  public id!: number;
  public userId!: number;
  public action!: string;
  public details!: string;
  public timestamp!: Date;
}

ActivityLog.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    action: { type: DataTypes.STRING(150), allowNull: false },
    details: { type: DataTypes.STRING(500), allowNull: true },
    timestamp: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    modelName: "ActivityLog",
    tableName: "activity_logs",
  }
);