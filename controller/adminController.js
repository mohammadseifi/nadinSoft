const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const appRoot = require('app-root-path');

const fs = require('fs');

const Admin = require("./../model/admin");
const User = require("../model/user");
const Task = require("../model/task");

exports.adminSignIn = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    if (userName) {
      await Admin.adminvalidation(req.body);
      const admin = await Admin.findOne({ userName: userName });
      if (admin) {
        const error = new Error("نام کاربری تکراری میباشد!!!");
        error.statusCode = 422;
        throw error;
      }
      const hashPass = await bcrypt.hash(password, 10);
      await Admin.create({
        userName: userName,
        password: hashPass,
      });
      res.status(201).json({
        message: "ادمین با موفقیت ثبت شد.",
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
exports.adminLogin = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    if (userName) {
      const admin = await Admin.findOne({ userName: userName });
      if (!admin) {
        const error = new Error("نام کاربری معتبر نمیباشد!!!");
        error.statusCode = 422;
        throw error;
      }
      const validate = await bcrypt.compare(password, admin.password);
      if (!validate) {
        const error = new Error("پسورد وارد شده صحیح نمیباشد!!!");
        error.statusCode = 422;
        throw error;
      }
      const token = await jwt.sign({
        userName: userName,
        role: admin.role
      },"SECRET");
      res.status(200).json({
        message: "ادمین با موفقیت وارد شد.",
        token: token,
      });
    } else {
      const error = new Error("درخواست شما معتبر نمیباشد!!!");
      error.statusCode = 400;
      throw error;
    }
  } catch (err) {
    next(err)
  }
};
exports.usersList = async(req, res, next)=>{
    try {
        if(req.role == "Admin"){
            const users = await User.find({})
            if(!users){
                const error = new Error("کاربری برای نمایش دادن وجود ندارد")
                error.statusCode = 404
                throw error
            }
            res.status(200).json({
                users: users.map(e => e.userName)
            })
        }else{
            const error = new Error("شما مجوز دسترسی به این بخش را ندارید!!!")
            error.statusCode = 422
            throw error
        }
    } catch (err) {
        next(err)
    }
}
exports.deleteUser = async(req, res, next)=>{
    try {
        if(req.role != "Admin"){
            const error = new Error("شما مجوز دسترسی به این بخش را ندارید!!!")
            error.statusCode = 422
            throw error
        }
        const user = await User.findById(req.params.id).populate("tasks")
        if(!user){
            const error = new Error("کاربر مورد نظر یافت نشد!!!")
            error.statusCode = 404
            throw error
        }
        if(user.tasks.length > 0){
            user.tasks.map( async(e)=>{
                console.log(e);
                await Task.findByIdAndDelete(e._id)
                
            } )
        }
        if(user.thumbnail != "undefind.jpg"){
            if(fs.existsSync(`${appRoot}/public/uploads/${user.thumbnail}`)){
                fs.unlink(`${appRoot}/public/uploads/${user.thumbnail}`,(err)=>{
                    if(err){
                        console.log(err);
                    }
                })
            }
        }
        await User.findByIdAndDelete(user._id)
        res.status(200).json({
            message: "کاربر با موفقیت حذف شد."
        })
    } catch (err) {
        next(err)
    }
}