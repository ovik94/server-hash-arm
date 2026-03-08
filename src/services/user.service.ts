import * as userRepository from '../repositories/user.repository';
import * as rolesRepository from '../repositories/roles.repository';

const transformUsers = (users: any[], roles: any[]) =>
  users.map((user) => ({
    name: user.name,
    role: user.role,
    privilege: (roles.find((role) => role.name === user.role) || {}).privilege,
    phone: user.phone,
    id: user._id,
  }));

export async function getUserList() {
  const users = await userRepository.findAllUsers();
  const roles = await rolesRepository.findAllRoles();

  return transformUsers(users, roles);
}

export async function addUser(payload: any) {
  await userRepository.createUser(payload);

  const users = await userRepository.findAllUsers();
  const roles = await rolesRepository.findAllRoles();

  return transformUsers(users, roles);
}

export async function editUser(payload: any) {
  const user = await userRepository.findUserById(payload.id);
  if (!user) {
    throw new Error('User not found');
  }

  user.name = payload.name;
  user.role = payload.role;
  user.phone = payload.phone;
  user.password = payload.password;

  await userRepository.saveUser(user);

  const users = await userRepository.findAllUsers();
  const roles = await rolesRepository.findAllRoles();

  return transformUsers(users, roles);
}

export async function deleteUser(id: string) {
  await userRepository.deleteUserById(id);

  const users = await userRepository.findAllUsers();
  const roles = await rolesRepository.findAllRoles();

  return transformUsers(users, roles);
}

export async function login(payload: { id: string; password: string }) {
  const user = await userRepository.findUserById(payload.id);

  if (!user) {
    const error: any = new Error('Пользователь не найден');
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  if (user.password !== payload.password) {
    const error: any = new Error('Неправильный пароль');
    error.code = 'WRONG_PASSWORD';
    throw error;
  }

  return true;
}
