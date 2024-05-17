const express = require("express");
const fileUpload = require('express-fileupload');

const path = require('path');

const errors = require("./middleware/errors");
const db = require("./config/db");
const users = require('./routes/users');
const admin = require('./routes/admin');
const tasks = require('./routes/tasks');
const headers = require("./middleware/headers");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")))
app.use(headers)

//* DataBase
db();

//* fileUpload
app.use(fileUpload())

app.use("/users",users)
app.use("/admin",admin)
app.use("/tasks",tasks)

app.use(errors);

app.listen(3000, () => {
  console.log(`server is running on port 3000`);
});
