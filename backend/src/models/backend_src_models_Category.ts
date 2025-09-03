import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";

export interface CategoryAttributes {
  id: number;
  name: string;
  description: string;
  type: "discussion" | "advert";
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, "id"> {}

export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public type!: "discussion" | "advert";
}

Category.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    description: { type: DataTypes.STRING(400), allowNull: false },
    type: { type: DataTypes.ENUM("discussion", "advert"), allowNull: false },
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "categories",
  }
);