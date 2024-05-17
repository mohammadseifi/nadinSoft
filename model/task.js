const mongoose = require("mongoose");
const { schema } = require("./secure/taskValidation");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  body: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 500,
  },
  ps: {
    type: String,
    default: '',
  },
});

taskSchema.statics.taskValidation = function (body) {
  return schema.validate(body, { abortEarly: false });
};

const Task = mongoose.model("tasks", taskSchema);
module.exports = Task;
