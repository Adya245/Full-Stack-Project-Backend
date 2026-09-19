const mongoose = require("mongoose")

const OrganizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxLength: 100
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        immutable: true,
        ref: "user"
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

const Organization = mongoose.model("organization", OrganizationSchema)

module.exports = {
    Organization
}