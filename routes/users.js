const express = require('express');
const { userSignIn, userLogin, editProfile, taskList, uploadProfile, getSingleTask } = require('../controller/userController');
const { isAuth } = require('../middleware/isAuth');

const router = express.Router()

router.post("/signIn", userSignIn)
router.post("/login",userLogin)
router.post("/editProfile",isAuth,editProfile)
router.get("/taskList",isAuth,taskList)
router.post("/uploadProfile", isAuth, uploadProfile)
router.get("/getSingleTask/:id",isAuth,getSingleTask)




module.exports = router