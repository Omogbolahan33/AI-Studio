import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";

export interface NotificationAttributes {
  id: number;
  userId: number;
  type: "like" | "comment" | "follow" | "system" | "post" | "follow_request";
  content: string;
  link: string;
  timestamp: Date;
  read: boolean;
  postId?: number;
  actorId?: number;
  transactionId?: number;
  chatId?: number;
  disputeId?: number;
}

interface NotificationCreationAttributes extends Optional<NotificationAttributes, "id" | "postId" | "actorId" | "transactionId" | "chatId" | "disputeId"> {}

export class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  public id!: number;
  public userId!: number;
  public type!: "like" | "comment" | "follow" | "system" | "post" | "follow_request";
  public content!: string;
  public link!: string;
  public timestamp!: Date;
  public read!: boolean;
  public postId?: number;
  public actorId?: number;
  public transactionId?: number;
  public chatId?: number;
  public disputeId?: number;
}

Notification.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.ENUM("like", "comment", "follow", "system", "post", "follow_request"), allowNull: false },
    content: { type: DataTypes.STRING(500), allowNull: false },
    link: { type: DataTypes.STRING, allowNull: false },
    timestamp: { type: DataTypes.DATE, allowNull: false },
    read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    postId: { type: DataTypes.INTEGER, allowNull: true },
    actorId: { type: DataTypes.INTEGER, allowNull: true },
    transactionId: { type: DataTypes.INTEGER, allowNull: true },
    chatId: { type: DataTypes.INTEGER, allowNull: true },
    disputeId: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "Notification",
    tableName: "notifications",
  }
);