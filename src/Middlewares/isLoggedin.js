const jwt = require("jsonwebtoken")
const {User} = require("../Models/UserSchema")
const {AppError} = require("../Utils/AppError")
const validator = require("validator")

const isLoggedin = async(req, res, next) => {

    const { token } = req.cookies

        if(!token)
    {
        throw new AppError(400, "Please log in")
    }

    if(!validator.isJWT(token))
    {
        throw new AppError(400, "Please provide a valid token")
    }


    const obj = jwt.verify(token, process.env.JWT_SECRET)

    const foundUser = await User.findById(obj.id).populate("organizationId")

    if(!foundUser)
    {
        next(new Error(4000, "User not found")) 
    }

    req.user = foundUser

    next()

}


module.exports = {
    isLoggedin
}