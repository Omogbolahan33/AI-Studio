import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";

export interface BankAccountAttributes {
  id: number;
  userId: number;
  accountName: string;
  accountNumber: string;
  bankName: string;
}

interface BankAccountCreationAttributes extends Optional<BankAccountAttributes, "id"> {}

export class BankAccount extends Model<BankAccountAttributes, BankAccountCreationAttributes> implements BankAccountAttributes {
  public id!: number;
  public userId!: number;
  public accountName!: string;
  public accountNumber!: string;
  public bankName!: string;
}

BankAccount.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    accountName: { type: DataTypes.STRING(150), allowNull: false },
    accountNumber: { type: DataTypes.STRING(30), allowNull: false },
    bankName: { type: DataTypes.STRING(100), allowNull: false },
  },
  {
    sequelize,
    modelName: "BankAccount",
    tableName: "bank_accounts",
  }
);