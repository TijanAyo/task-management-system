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
import { Role } from "./role";
import { RolePermission } from "./role_permission";

@Table({
  timestamps: true,
  tableName: "Permissions",
})
class Permission extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  title!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  deletedFlag!: boolean;

  @BelongsToMany(() => Role, () => RolePermission)
  roles!: Role[];
}

export { Permission };
