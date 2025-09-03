import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";

export interface PostAttributes {
  id: number;
  authorId: number;
  timestamp: Date;
  lastActivityTimestamp: Date;
  editedTimestamp?: Date;
  title: string;
  content: string;
  isAdvert: boolean;
  price?: number;
  categoryId: number;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  brand?: string;
  condition?: "New" | "Used - Like New" | "Used - Good" | "Used - Fair";
  pinnedAt?: Date;
}

interface PostCreationAttributes extends Optional<PostAttributes, "id" | "editedTimestamp" | "price" | "mediaUrl" | "mediaType" | "brand" | "condition" | "pinnedAt"> {}

export class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id!: number;
  public authorId!: number;
  public timestamp!: Date;
  public lastActivityTimestamp!: Date;
  public editedTimestamp?: Date;
  public title!: string;
  public content!: string;
  public isAdvert!: boolean;
  public price?: number;
  public categoryId!: number;
  public mediaUrl?: string;
  public mediaType?: "image" | "video";
  public brand?: string;
  public condition?: "New" | "Used - Like New" | "Used - Good" | "Used - Fair";
  public pinnedAt?: Date;
}

Post.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    authorId: { type: DataTypes.INTEGER, allowNull: false },
    timestamp: { type: DataTypes.DATE, allowNull: false },
    lastActivityTimestamp: { type: DataTypes.DATE, allowNull: false },
    editedTimestamp: { type: DataTypes.DATE, allowNull: true },
    title: { type: DataTypes.STRING(180), allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    isAdvert: { type: DataTypes.BOOLEAN, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: true },
    categoryId: { type: DataTypes.INTEGER, allowNull: false },
    mediaUrl: { type: DataTypes.STRING, allowNull: true },
    mediaType: { type: DataTypes.ENUM("image", "video"), allowNull: true },
    brand: { type: DataTypes.STRING, allowNull: true },
    condition: { type: DataTypes.ENUM("New", "Used - Like New", "Used - Good", "Used - Fair"), allowNull: true },
    pinnedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    modelName: "Post",
    tableName: "posts",
  }
);