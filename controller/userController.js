const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuid").v4;
const appRoot = require("app-root-path");
const sharp = require("sharp");

const fs = require("fs");

const User = require("../model/user");
const Task = require("../model/task");

exports.userSignIn = async (req, res, next) => {
  try {
    const { userName, email, password, repeatPass, phoneNumber } = req.body;
    if (email) {
      const validator = await User.userValidation(req.body);
      console.log(validator);
      const validate1 = await User.findOne({ userName });
      const validate2 = await User.findOne({ phoneNumber });
      if (validate1 || validate2) {
        const error = new Error("نام کاربری یا شماره تلفن تکراری میباشد!!!");
        error.statusCode = 422;
        throw error;
      }
      const hashPass = await bcrypt.hash(password, 10);
      await User.create({
        userName: userName,
        email: email,
        password: hashPass,
        phoneNumber: phoneNumber,
        thumbnail: "undefine.jpg",
      });
      res.status(201).json({
        message: "کاربر با موفقیت ثبت نام شد.",
      });
    } else {
      const error = new Error("درخواست شما معتبر نمیباشد!!!");
      error.statusCode = 400;
      throw error;
    }
  } catch (err) {
    next(err);
  }
};
exports.userLogin = async (req, res, next) => {
  try {
    if (req.body) {
      const { userName, password } = req.body;
      const user = await User.findOne({ userName: userName });
      if (!user) {
        const error = new Error("نام کاربری معتبر نمیباشد!!!");
        error.statusCode = 422;
        throw error;
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        const error = new Error("رمز وارد شده صحیح نمیباشد!!!");
        error.statusCode = 422;
        throw error;
      }
      const token = await jwt.sign(
        {
          userName: userName,
          role: user.role,
        },
        "SECRET"
      );
      return res.status(200).json({
        message: "با موفقیت وارد شدید.",
        token: token,
      });
    } else {
      const error = new Error("درخواست شما معتبر نمیباشد!!!");
      error.statusCode = 400;
      throw error;
    }
  } catch (err) {
    next(err);
  }
};
exports.editProfile = async (req, res, next) => {
  try {
    if (req.role == "User" && req.userName) {
      const user = await User.findOne({ userName: req.userName });
      if (!user) {
        const error = new Error("کاربری با این مشخصات یافت نشد!!!");
        error.statusCode = 404;
        throw error;
      }
      const { email, password, repeatPass, phoneNumber } = req.body;
      if (email) {
        user.email = email;
      }
      if (phoneNumber) {
        user.phoneNumber = phoneNumber;
      }
      if (password) {
        if (!repeatPass) {
          const error = new Error("وارد کردن تکرار رمز عبور الزامی میباشد!!!");
          error.statusCode = 422;
          throw error;
        }
        await User.userValidation({
          userName: user.userName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          password: password,
          repeatPass: repeatPass,
        });
        const hashPass = await bcrypt.hash(password, 10);
        user.password = hashPass;
      } else {
        await User.userValidation({
          userName: user.userName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          password: "12345678",
          repeatPass: "12345678",
        });
      }
      user.save();
      res.status(200).json({
        message: "عملیات با موفقیت انجام شد.",
      });
    }
  } catch (err) {
    next(err);
  }
};
exports.taskList = async (req, res, next) => {
  try {
    if (req.role == "User") {
      const user = await User.findOne({ userName: req.userName }).populate(
        "tasks"
      );
      console.log(user.tasks);
      if (!user) {
        const error = new Error("کاربری یافت نشد!!!");
        error.statusCode = 404;
        throw error;
      }
      if (user.tasks.length < 1) {
        const error = new Error("تسکی برای نمایش دادن وجود ندارد!");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        tasks: user.tasks.map((e) => e.title),
      });
    }
  } catch (err) {
    next(err);
  }
};
exports.uploadProfile = async (req, res, next) => {
  const thumbnail = req.files ? req.files.thumbnail : {};
  const fileName = `${uuid()}_${thumbnail.name}`;
  const filePath = `${appRoot}/public/uploads/${fileName}`;
  try {
    const user = await User.findOne({ userName: req.userName });
    if (!user) {
      const error = new Error("کاربری با این مشخصات یافت نشد!");
      error.statusCode = 404;
      throw error;
    }
    if (!thumbnail.name) {
      const error = new Error("عکسی جهت آپلود وجود ندارد!!!");
      error.statusCode = 404;
      throw error;
    }
    await User.userValidation({
      userName: user.userName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      password: "12345678",
      repeatPass: "12345678",
      thumbnail: thumbnail,
    });
    if (thumbnail.size !== undefined) {
      if (fs.existsSync(`${appRoot}/public/uploads/${user.thumbnail}`)) {
        console.log(22);
        fs.unlink(
          `${appRoot}/public/uploads/${user.thumbnail}`,
          async (err) => {
            if (err) {
              console.log(err);
            } else {
              user.thumbnail = fileName;
              await sharp(thumbnail.data)
                .jpeg({
                  quality: 60,
                })
                .toFile(filePath)
                .catch((err) => {
                  console.log(err);
                });
            }
          }
        );
      } else {
        user.thumbnail = fileName;
        await sharp(thumbnail.data)
          .jpeg({
            quality: 60,
          })
          .toFile(filePath)
          .catch((err) => {
            console.log(err);
          });
      }
      await user.save();
      res.status(200).json({
        message: "پروفایل با موفقیت ثبت شد.",
      });
    }
  } catch (err) {
    next(err);
  }
};
exports.getSingleTask = async (req, res, next) => {
  try {
    const user = await User.findOne({ userName: req.userName }).populate(
      "tasks"
    );
    if (!user) {
      const error = new Error("کاربری برای نمایش یافت نشد");
      error.statusCode = 404;
      throw error;
    }
    const task = await Task.findById(req.params.id);
    if (!task) {
      const error = new Error("تسکی برای نمایش یافت نشد!");
      error.statusCode = 404;
      throw error;
    }
    let validate = true
    user.tasks.map((e) => {
      if (e._id.toString() == task._id.toString()) {
        validate = false
        res.status(200).json({
          title: e.title,
          body: e.body,
        });
      } 
    });   
    if (validate) {
      const error = new Error("شما مجوز دسترسی به این تسک را ندارید!!!");
      error.status = 422;
      throw error;
    }
  } catch (err) {
    next(err);
  }
};
