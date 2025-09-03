import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";

export interface DisputeAttributes {
  id: number;
  transactionId: number;
  buyerId: number;
  sellerId: number;
  reason: string;
  status: "Open" | "Resolved" | "Escalated";
  openedDate: Date;
  resolvedByAdminId?: number;
}

interface DisputeCreationAttributes extends Optional<DisputeAttributes, "id" | "resolvedByAdminId"> {}

export class Dispute extends Model<DisputeAttributes, DisputeCreationAttributes> implements DisputeAttributes {
  public id!: number;
  public transactionId!: number;
  public buyerId!: number;
  public sellerId!: number;
  public reason!: string;
  public status!: "Open" | "Resolved" | "Escalated";
  public openedDate!: Date;
  public resolvedByAdminId?: number;
}

Dispute.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    transactionId: { type: DataTypes.INTEGER, allowNull: false },
    buyerId: { type: DataTypes.INTEGER, allowNull: false },
    sellerId: { type: DataTypes.INTEGER, allowNull: false },
    reason: { type: DataTypes.STRING(350), allowNull: false },
    status: { type: DataTypes.ENUM("Open", "Resolved", "Escalated"), allowNull: false, defaultValue: "Open" },
    openedDate: { type: DataTypes.DATE, allowNull: false },
    resolvedByAdminId: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "Dispute",
    tableName: "disputes",
  }
);