import "reflect-metadata";
import {
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  Model,
  DataType,
  Default,
  BelongsToMany,
  AllowNull,
} from "sequelize-typescript";
import { Permission } from "./permission";
import { RolePermission } from "./role_permission";

@Table({
  timestamps: true,
  tableName: "Roles",
})
class Role extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  @AllowNull(false)
  title!: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  deletedFlag!: boolean;

  @BelongsToMany(() => Permission, () => RolePermission)
  permissions!: Permission[];
}

export { Role };
