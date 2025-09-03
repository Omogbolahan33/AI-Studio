import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";

export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  role: "Super Admin" | "Admin" | "Member";
  name: string;
  avatarUrl?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  isActive: boolean;
  isVerified: boolean;
  banExpiresAt?: Date | null;
  banReason?: string | null;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "avatarUrl" | "address" | "city" | "zipCode" | "banExpiresAt" | "banReason"> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public role!: "Super Admin" | "Admin" | "Member";
  public name!: string;
  public avatarUrl?: string;
  public address?: string;
  public city?: string;
  public zipCode?: string;
  public isActive!: boolean;
  public isVerified!: boolean;
  public banExpiresAt?: Date | null;
  public banReason?: string | null;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("Super Admin", "Admin", "Member"), allowNull: false, defaultValue: "Member" },
    name: { type: DataTypes.STRING(120), allowNull: false },
    avatarUrl: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    zipCode: { type: DataTypes.STRING, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    isVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    banExpiresAt: { type: DataTypes.DATE, allowNull: true },
    banReason: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
  }
);