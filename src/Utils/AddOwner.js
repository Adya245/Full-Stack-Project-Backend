const bcrypt = require("bcrypt")
const {User} = require("../Models/UserSchema")

const addOwner = (name, email, password) => {
bcrypt.hash(password, 10)
    .then((data) => {
        User.create({
            name ,
            email ,
            password : data,
            role : "owner"
        })
    })
}


module.exports = { addOwner }
