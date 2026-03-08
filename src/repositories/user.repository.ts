import { UserModel } from '../models/user.model';

export async function findAllUsers() {
  return UserModel.find();
}

export async function findUserById(id: string) {
  return UserModel.findById(id);
}

export async function createUser(data: any) {
  const newUser = new UserModel(data);
  return newUser.save();
}

export async function saveUser(user: any) {
  return user.save();
}

export async function deleteUserById(id: string) {
  return UserModel.deleteOne({ _id: id });
}
