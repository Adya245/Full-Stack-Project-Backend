const { AppError } = require("../Utils/AppError")
const {Organization} = require("../Models/OrganizationSchema")
const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const { User } = require("../Models/UserSchema")

const createOrgs = async(req, res) => {
    const {name, isActive} = req.body

    if(!name.trim() || name.trim().length > 100)
    {
        throw new AppError(400, "Invalid Name")
    }

    const createdOrg = await Organization.create({
        name,
        isActive,
        createdBy: req.user._id
    })

    res
    .status(201)
    .json({
        message: "Organization created",
        data: createdOrg
    })
}


const getAllOrgs = async(req, res) => {
    
    const {skip, limit} = req.query

    const data = await Organization.find().limit(limit).skip(skip * limit)

    res
    .status(200)
    .json({
        data
    })
}


const getOrgById = async(req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError(400, "Invalid ID")
    }

    const data = await Organization.findById(id)

    if(!data)
    {
        throw new AppError(404, "Organization does not exist..")
    }

    res
    .status(200)
    .json({
        data
    })
}


const deleteOrg = async(req, res) => {
    const {id} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError(400, "Invalid ID")
    }

    const data = await Organization.findByIdAndUpdate(id, {isActive: false}, {returnDocument: "after"})  // Soft deletion

    if(!data)
    {
        throw new AppError(404, "Organization does not exist..")
    }

    res
    .status(200)
    .json({
        message: "Organization deleted",
        data
    })
}


const UpdateOrg = async(req, res) => {
    const {id} = req.params

    if(!id || !mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError(400, "Invalid ID")
    }

    const {name, isActive} = req.body

    if(!name.trim() || name.trim().length > 100)
    {
        throw new AppError(400, "Invalid name")
    }

    const updatedOrg = await Organization.findByIdAndUpdate(id, {name, isActive}, {runValidators: true, returnDocument: "after"})

    if(!updatedOrg)
    {
        throw new AppError(404, "Organization does not exist..")
    }

    res
    .status(404)
    .json({
        message: "Organization updated",
        data: updatedOrg
    })
}


const createAdmin = async(req, res) => {

    const {id} = req.params

    if(!id || !mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError(400, "Invalid ID")
    }

    const {email, password, name} = req.body

    if(!email)
    {
        throw new AppError(400, "Email is required")
    }
    if(!validator.isEmail(email))
    {
        throw new AppError(400, `${email} is not a valid email`)
    }

    if(!password)
    {
        throw new AppError(400, "Password is required")
    }
    if(!validator.isStrongPassword(password))
    {
        throw new AppError(400, `${password} is not a strong password`)
    }

    if(!name)
    {
        throw new AppError(400, "Name is required")
    }
    if(!name.trim() || name.trim().length > 20 || name.trim().length < 2)
    {
        throw new AppError(400, 'Invalid name')
    }

    const foundOrg = await Organization.findById(id)

    if(!foundOrg)
    {
        throw new AppError(404, "Organization does not exist..")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const createdAdmin = await User.create({
        name,
        password: hashedPassword,
        email,
        role: "admin",
        organizationId: id,
        isActive: foundOrg.isActive
    })

    res
    .status(201)
    .json({
        data : createdAdmin,
        message : foundOrg.isActive ?  
        `Admin created under organization ${foundOrg.name}` : 
        `Admin created under organization ${foundOrg.name} which is currently INACTIVE`
    })
}

const getAllAdmin = async(req, res) => {
    const {id} = req.params

    if(!id || !mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError(400, "Invalid ID")
    }

    const foundOrg = await Organization.findById(id)

    if(!foundOrg)
    {
        throw new AppError(404, "Organization does not exist..")
    }

    const foundAdmins = await User.find({
        organizationId: foundOrg._id,
        role: "admin"
    })

    res
    .status(200)
    .json({
        data: foundAdmins,
        message: foundOrg.isActive ?
        "Organization ACTIVE" :
        "Organization INACTIVE"
    })
}


const getAdminById = async(req, res) => {
    const {id} = req.params

    if(!id || !mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError(400, "Invalid ID")
    }

    const foundUser = await User.findById(id)

    if(!foundUser)
    {
        throw new AppError(404, "User does not exist..")
    }

    const foundOrg = await Organization.findById(foundUser.organizationId)

    res
    .status(200)
    .json({
        data: foundUser,
        message: foundOrg.isActive ?
        "Organization ACTIVE" :
        "Organization INACTIVE" 
    })  

}


const activateAdmin = async(req, res) => {
    const {id} = req.params

    if(!id || !mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError(400, "Invalid ID")
    }

    const foundUser = await User.findById(id)

    if(!foundUser)
    {
        throw new AppError(404, "User does not exist..")
    }

    foundUser.isActive = true
    await foundUser.save()

    res
    .status(200)
    .json({
        message : `${foundUser.name} activated successfully`,
        data : foundUser
    })
}


const deactivateAdmin = async(req, res) => {
    const {id} = req.params

    if(!id || !mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError(400, "InvalidID")
    }

    const foundUser = await User.findById(id)

    if(!foundUser)
    {
        throw new AppError(404, "User does not exist..")
    }

    foundUser.isActive = false
    await foundUser.save()

    res
    .status(200)
    .json({
        message : `${foundUser.name} activated successfully`,
        data: foundUser 
    })

}
    


module.exports = {
    createOrgs,
    getAllOrgs,
    getOrgById,
    deleteOrg,
    UpdateOrg,
    createAdmin,
    getAllAdmin,
    getAdminById,
    activateAdmin,
    deactivateAdmin
}