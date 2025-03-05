const UserModel = require("../model/user");
const RolesModel = require("../model/roles");

const transformedUsers = (users, roles) =>
  users.map((user) => ({
    name: user.name,
    role: user.role,
    privilege: (roles.find((role) => role.name === user.role) || {}).privilege,
    phone: user.phone,
    id: user._id,
  }));

async function getUserList(req, res) {
  let users;

  try {
    users = await UserModel.find();
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  const roles = await RolesModel.find();
  const data = transformedUsers(users, roles);

  return res.json({ status: "OK", data });
}

async function addUser(req, res) {
  const newUser = new UserModel(req.body);

  try {
    await newUser.save();
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  const users = await UserModel.find();
  const roles = await RolesModel.find();

  const data = transformedUsers(users, roles);

  return res.json({ status: "OK", data });
}

async function editUser(req, res) {
  const user = await UserModel.findById(req.body.id);

  user.name = req.body.name;
  user.role = req.body.role;
  user.phone = req.body.phone;
  user.password = req.body.password;

  try {
    await user.save();
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  const roles = await RolesModel.find();
  const users = await UserModel.find();
  const data = await transformedUsers(users, roles);

  return res.json({ status: "OK", data });
}

async function deleteUser(req, res) {
  try {
    await UserModel.deleteOne({ _id: req.body.id });
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  const users = await UserModel.find();
  const roles = await RolesModel.find();
  const data = await transformedUsers(users, roles);

  return res.json({ status: "OK", data });
}

async function login(req, res) {
  let user;

  try {
    user = await UserModel.findById(req.body.id);
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  if (user.password !== req.body.password) {
    return res.json({ status: "ERROR", message: "Неправильный пароль" });
  }

  return res.json({ status: "OK" });
}

module.exports = { getUserList, addUser, editUser, deleteUser, login };
