const { User } = require("../Models/UserSchema")
const { AppError } = require("../Utils/AppError")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


const Login = async(req, res) => {

    const {email, password} = req.body

    if(!email)
    {
        throw new AppError(400, "email is required...")
    }
    else if(!password)
    {
        throw new AppError(400, "password is required...")
    }

    const foundUser = await User.findOne({email})

    if(!foundUser)
    {
        throw new AppError(401, "User does not exists!")
    }

    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password)

    if(!isPasswordCorrect)
    {
        throw new AppError(409, "Invalid Credentials")
    }

    const token = jwt.sign(
        {id: foundUser._id}, 
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    res
    .status(200)
    .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
         httpOnly : true,
        sameSite : "strict",
        // secure : true
    })
    .json({
        message : "User logged in"
    })
}


const Logout = async(req, res) => {

    res
    .clearCookie("token")
    .json({
        msg: "User Logged Out.."
    })
}


const Me = async(req, res) => {
    const {name, email, role, isActive} = req.user

    res.json({
        data: {name, email, role, isActive},
        message: "Done"
    })
}


module.exports = {
    Login, Logout, Me
}