import "reflect-metadata";
import { Table, Model, ForeignKey } from "sequelize-typescript";
import { Role } from "./role";
import { Permission } from "./permission";

@Table({
  timestamps: true,
  tableName: "Roles_permission",
})
class RolePermission extends Model {
  @ForeignKey(() => Role)
  roleId!: number;

  @ForeignKey(() => Permission)
  permissionId!: number;
}

export { RolePermission };
