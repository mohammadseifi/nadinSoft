const express = require('express');
const { createTask } = require('../controller/taskController');
const { isAuth } = require('../middleware/isAuth');

const router = express.Router()

router.post("/create",isAuth,createTask)

module.exports = router