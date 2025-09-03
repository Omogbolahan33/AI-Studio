import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";

export interface CommentAttributes {
  id: number;
  postId: number;
  authorId: number;
  content: string;
  timestamp: Date;
  editedTimestamp?: Date;
  mediaUrl?: string;
  mediaType?: "image" | "video";
}

interface CommentCreationAttributes extends Optional<CommentAttributes, "id" | "editedTimestamp" | "mediaUrl" | "mediaType"> {}

export class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  public id!: number;
  public postId!: number;
  public authorId!: number;
  public content!: string;
  public timestamp!: Date;
  public editedTimestamp?: Date;
  public mediaUrl?: string;
  public mediaType?: "image" | "video";
}

Comment.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    postId: { type: DataTypes.INTEGER, allowNull: false },
    authorId: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    timestamp: { type: DataTypes.DATE, allowNull: false },
    editedTimestamp: { type: DataTypes.DATE, allowNull: true },
    mediaUrl: { type: DataTypes.STRING, allowNull: true },
    mediaType: { type: DataTypes.ENUM("image", "video"), allowNull: true },
  },
  {
    sequelize,
    modelName: "Comment",
    tableName: "comments",
  }
);