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
  HasMany,
} from "sequelize-typescript";
import { Permission } from "./permission";
import { RolePermission } from "./role_permission";
import { User } from "./user";

@Table({
  timestamps: true,
  tableName: "Roles",
})
class Role extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  deletedFlag!: boolean;

  @BelongsToMany(() => Permission, () => RolePermission)
  permissions!: Permission[];

  @HasMany(() => User)
  users!: User[];
}

export { Role };
