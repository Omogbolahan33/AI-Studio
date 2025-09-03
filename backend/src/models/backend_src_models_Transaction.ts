import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";

export interface TransactionAttributes {
  id: number;
  postId?: number;
  buyerId: number;
  sellerId: number;
  item: string;
  amount: number;
  status: "Pending" | "Completed" | "In Escrow" | "Shipped" | "Delivered" | "Disputed" | "Cancelled";
  date: Date;
  trackingNumber?: string;
  shippingProofUrl?: string;
  inspectionPeriodEnds?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  failureReason?: string;
  refundedAmount?: number;
}

interface TransactionCreationAttributes extends Optional<TransactionAttributes, "id" | "postId" | "trackingNumber" | "shippingProofUrl" | "inspectionPeriodEnds" | "shippedAt" | "deliveredAt" | "completedAt" | "cancelledAt" | "failureReason" | "refundedAmount"> {}

export class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
  public id!: number;
  public postId?: number;
  public buyerId!: number;
  public sellerId!: number;
  public item!: string;
  public amount!: number;
  public status!: "Pending" | "Completed" | "In Escrow" | "Shipped" | "Delivered" | "Disputed" | "Cancelled";
  public date!: Date;
  public trackingNumber?: string;
  public shippingProofUrl?: string;
  public inspectionPeriodEnds?: Date;
  public shippedAt?: Date;
  public deliveredAt?: Date;
  public completedAt?: Date;
  public cancelledAt?: Date;
  public failureReason?: string;
  public refundedAmount?: number;
}

Transaction.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    postId: { type: DataTypes.INTEGER, allowNull: true },
    buyerId: { type: DataTypes.INTEGER, allowNull: false },
    sellerId: { type: DataTypes.INTEGER, allowNull: false },
    item: { type: DataTypes.STRING(200), allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    status: { 
      type: DataTypes.ENUM("Pending", "Completed", "In Escrow", "Shipped", "Delivered", "Disputed", "Cancelled"), 
      allowNull: false, 
      defaultValue: "Pending" 
    },
    date: { type: DataTypes.DATE, allowNull: false },
    trackingNumber: { type: DataTypes.STRING, allowNull: true },
    shippingProofUrl: { type: DataTypes.STRING, allowNull: true },
    inspectionPeriodEnds: { type: DataTypes.DATE, allowNull: true },
    shippedAt: { type: DataTypes.DATE, allowNull: true },
    deliveredAt: { type: DataTypes.DATE, allowNull: true },
    completedAt: { type: DataTypes.DATE, allowNull: true },
    cancelledAt: { type: DataTypes.DATE, allowNull: true },
    failureReason: { type: DataTypes.STRING, allowNull: true },
    refundedAmount: { type: DataTypes.FLOAT, allowNull: true },
  },
  {
    sequelize,
    modelName: "Transaction",
    tableName: "transactions",
  }
);