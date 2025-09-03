import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";

export interface ReviewAttributes {
  id: number;
  reviewerId: number;
  userId: number;
  rating: number;
  comment: string;
  timestamp: Date;
  isVerifiedPurchase?: boolean;
  transactionId?: number;
}

interface ReviewCreationAttributes extends Optional<ReviewAttributes, "id" | "isVerifiedPurchase" | "transactionId"> {}

export class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public id!: number;
  public reviewerId!: number;
  public userId!: number;
  public rating!: number;
  public comment!: string;
  public timestamp!: Date;
  public isVerifiedPurchase?: boolean;
  public transactionId?: number;
}

Review.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    reviewerId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: false },
    timestamp: { type: DataTypes.DATE, allowNull: false },
    isVerifiedPurchase: { type: DataTypes.BOOLEAN, allowNull: true },
    transactionId: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "Review",
    tableName: "reviews",
  }
);