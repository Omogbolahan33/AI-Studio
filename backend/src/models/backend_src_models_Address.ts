import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";

export interface AddressAttributes {
  id: number;
  userId: number;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

interface AddressCreationAttributes extends Optional<AddressAttributes, "id"> {}

export class Address extends Model<AddressAttributes, AddressCreationAttributes> implements AddressAttributes {
  public id!: number;
  public userId!: number;
  public address!: string;
  public city!: string;
  public zipCode!: string;
  public country!: string;
}

Address.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    address: { type: DataTypes.STRING(300), allowNull: false },
    city: { type: DataTypes.STRING(80), allowNull: false },
    zipCode: { type: DataTypes.STRING(30), allowNull: false },
    country: { type: DataTypes.STRING(80), allowNull: false },
  },
  {
    sequelize,
    modelName: "Address",
    tableName: "addresses",
  }
);