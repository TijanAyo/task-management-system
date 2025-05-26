import "reflect-metadata";
import {
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  Model,
  DataType,
  AllowNull,
  Default,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import { User } from "./user";

@Table({
  timestamps: true,
  tableName: "Tasks",
})
class Task extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  description?: string;

  @AllowNull(false)
  @Default("pending")
  @Column(DataType.ENUM("pending", "in-progress", "completed"))
  status!: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  deletedFlag!: boolean;

  @AllowNull(true)
  @Column(DataType.DATE)
  startTime?: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  endTime?: Date;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}

export { Task };
