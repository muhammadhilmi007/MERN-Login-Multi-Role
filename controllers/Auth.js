import User from "../models/UserModel.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user)
    return res.status(404).json({
      message: "User tidak ditemukan",
    });
  const matchPassword = await argon2.verify(user.password, req.body.password);
  if (!matchPassword)
    return res.status(400).json({
      message: "Password salah",
    });
  req.session.userId = user.uuid;

  const uuid = user.uuid;
  const name = user.name;
  const email = user.email;
  const role = user.role;

  res.status(200).json({
    message: "Login berhasil",
    user: {
      uuid,
      name,
      email,
      role,
    },
  });
};

export const Me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Mohon login ke akun Anda!",
    });
  }

  const user = await User.findOne({
    attributes: ["uuid", "name", "email", "role"],
    where: {
      uuid: req.session.userId,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "User tidak ditemukan",
    });
  }

  const uuid = user.uuid;
  const name = user.name;
  const email = user.email;
  const role = user.role;

  res.status(200).json({
    message: "Data user berhasil ditemukan",
    user: {
      uuid,
      name,
      email,
      role,
    },
  });
};

export const Logout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        message: "Logout gagal",
      });
    }
    res.status(200).json({
      message: "Logout berhasil",
    });
  });
};
