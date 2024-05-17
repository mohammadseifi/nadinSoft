const express = require("express");
const { adminSignIn, adminLogin, usersList, deleteUser } = require("../controller/adminController");
const { isAuth } = require("../middleware/isAuth");

const router = express.Router();

router.post("/signIn", adminSignIn);
router.post("/login", adminLogin)
router.get("/usersList",isAuth,usersList)
router.get("/deleteUser/:id",isAuth,deleteUser)

module.exports = router;
