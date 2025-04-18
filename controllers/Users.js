import Users from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async (req, res) => {
  try {
    const response = await Users.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await Users.findByPk(req.params.id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password tidak cocok" });
  const hashPassword = await argon2.hash(password);

  try {
    const user = await Users.create({
      name,
      email,
      password: hashPassword,
      role,
    });
    res.status(201).json(user, { msg: "Register Berhasil" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUser = (req, res) => {};

export const deleteUser = (req, res) => {};
