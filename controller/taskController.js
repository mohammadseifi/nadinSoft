const jwt = require("jsonwebtoken");

const Task = require("./../model/task");
const User = require("../model/user");

exports.createTask = async (req, res, next) => {
  try {
    const {title, body} = req.body
    if(title){
        const user = await User.findOne({ userName: req.userName });
        if (!user) {
          const error = new Error("نام کاربری معتبر نمیباشد!!!");
          error.statusCode = 422;
          throw error;
        }
        await Task.taskValidation(req.body)
        const task = await Task.create({
            title: title,
            body: body
        })
        user.tasks.push(task._id) 
        user.save()
        res.status(201).json({
            message: "تسک با موفقیت ثبت گردید."
        })
    }

  } catch (err) {
    next(err);
  }
};
