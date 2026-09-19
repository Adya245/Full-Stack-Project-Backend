const express = require("express")
const router = express.Router()
const { isLoggedin } = require("../Middlewares/isLoggedin")
const {Login, Logout, Me} = require("../Controllers/AuthController")

router.post("/login", Login)


router.post("/logout", Logout)


router.get("/me", isLoggedin, Me)


module.exports = {
    UserRouter : router
}