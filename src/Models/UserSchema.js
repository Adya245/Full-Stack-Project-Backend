const mongoose = require("mongoose")
const validator = require("validator")
const { default: isEmail } = require("validator/lib/isEmail")


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 30,
        immutable: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        immutable: true,
        unique: true,
        validate: {
            message: "{VALUE} is not a vali email!",
            validator: (info) => {
                return validator.isEmail(info)
            }
        }
    },
    role: {
        type: String,
        required: true,
        trim: true,
        enum: {
            values: ["owner", "admin", "employee"],
            message: "{VALUE} is not a valid role"
        }
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "organization"
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})


const User = mongoose.model("user", UserSchema)

module.exports = {
    User
}