import { RoleModel } from "../models/roles.model";

export async function findAllRoles() {
  return RoleModel.find();
}

