import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";

export interface ChatAttributes {
  id: number;
  buyerId: number;
  sellerId: number;
  postId?: number;
  transactionId?: number;
  lastMessage: string;
  lastMessageTimestamp: Date;
}

interface ChatCreationAttributes extends Optional<ChatAttributes, "id" | "postId" | "transactionId"> {}

export class Chat extends Model<ChatAttributes, ChatCreationAttributes> implements ChatAttributes {
  public id!: number;
  public buyerId!: number;
  public sellerId!: number;
  public postId?: number;
  public transactionId?: number;
  public lastMessage!: string;
  public lastMessageTimestamp!: Date;
}

Chat.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    buyerId: { type: DataTypes.INTEGER, allowNull: false },
    sellerId: { type: DataTypes.INTEGER, allowNull: false },
    postId: { type: DataTypes.INTEGER, allowNull: true },
    transactionId: { type: DataTypes.INTEGER, allowNull: true },
    lastMessage: { type: DataTypes.STRING, allowNull: false },
    lastMessageTimestamp: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    modelName: "Chat",
    tableName: "chats",
  }
);