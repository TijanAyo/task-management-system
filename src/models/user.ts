import "reflect-metadata";
import {
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  Model,
  DataType,
  Unique,
  AllowNull,
  Validate,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { Role } from "./role";
import { Task } from "./task";

@Table({
  timestamps: true,
  tableName: "Users",
})
class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Unique
  @AllowNull(false)
  @Validate({ isEmail: true })
  @Column(DataType.STRING)
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password!: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  deletedFlag!: boolean;

  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  roleId!: number;

  @BelongsTo(() => Role)
  role!: Role;

  @HasMany(() => Task)
  tasks!: Task[];
}

export { User };
