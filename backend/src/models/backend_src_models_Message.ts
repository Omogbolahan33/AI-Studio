import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";

export interface MessageAttributes {
  id: number;
  chatId: number;
  senderId: number;
  timestamp: Date;
  text?: string;
  stickerUrl?: string;
  voiceNoteUrl?: string;
  voiceNoteDuration?: number;
  attachmentUrl?: string;
  attachmentType?: string;
  replyToMessageId?: number;
  isForwarded?: boolean;
}

interface MessageCreationAttributes extends Optional<MessageAttributes, "id" | "text" | "stickerUrl" | "voiceNoteUrl" | "voiceNoteDuration" | "attachmentUrl" | "attachmentType" | "replyToMessageId" | "isForwarded"> {}

export class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  public id!: number;
  public chatId!: number;
  public senderId!: number;
  public timestamp!: Date;
  public text?: string;
  public stickerUrl?: string;
  public voiceNoteUrl?: string;
  public voiceNoteDuration?: number;
  public attachmentUrl?: string;
  public attachmentType?: string;
  public replyToMessageId?: number;
  public isForwarded?: boolean;
}

Message.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    chatId: { type: DataTypes.INTEGER, allowNull: false },
    senderId: { type: DataTypes.INTEGER, allowNull: false },
    timestamp: { type: DataTypes.DATE, allowNull: false },
    text: { type: DataTypes.TEXT, allowNull: true },
    stickerUrl: { type: DataTypes.STRING, allowNull: true },
    voiceNoteUrl: { type: DataTypes.STRING, allowNull: true },
    voiceNoteDuration: { type: DataTypes.INTEGER, allowNull: true },
    attachmentUrl: { type: DataTypes.STRING, allowNull: true },
    attachmentType: { type: DataTypes.STRING, allowNull: true },
    replyToMessageId: { type: DataTypes.INTEGER, allowNull: true },
    isForwarded: { type: DataTypes.BOOLEAN, allowNull: true },
  },
  {
    sequelize,
    modelName: "Message",
    tableName: "messages",
  }
);