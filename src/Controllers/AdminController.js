const { default: mongoose } = require("mongoose")
const { Team } = require("../Models/TeamSchema")
const { AppError } = require("../Utils/AppError")


const addTeam = async(req, res) => {

    const {name} = req.body

    if(!name.trim() || name.trim().length > 50)
    {
        throw new AppError(400, "Invalid name..")
    }

    const createdTeam = await Team.create({
        name,
        adminId: req.user._id,
        organizationId: req.user.organizationId._id
    })

    res
    .status(201)
    .json({
        message: "Team created successfully",
        data: createdTeam
    })
}

const getAllTeam = async(req, res) => {

    const organizationId = req.user.organizationId._id
    const foundTeams = await Team.find({organizationId})

    res
    .status(200)
    .json({
        data: foundTeams
    })
}

const getTeamById = async(req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError(400, "Invalid Id..")
    }

    const foundTeam = await Team.findOne({
        _id: id,
        organizationId: req.user.organizationId._id
    })

    if(!foundTeam)
    {
        throw new AppError(404, "Team does not exist...")
    }

    res
    .status(200)
    .json({
        data: foundTeam
    })
}

const deleteTeam = async(req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError(400, "Invalid ID..")
    }

    const foundTeam = await Team.findOne({
        _id: id,
        organizationId: req.user.organizationId._id
    })

    if(!foundTeam)
    {
        throw new AppError(404, "Team does not exist..")
    }

    foundTeam.isActive = false
    await foundTeam.save()

    res
    .status(200)
    .json({
        message: "Team deleted successfully"
    })
}

const updateTeam = async(req, res) => {
    const {id} = req.params
    const {name, isActive} = req.user

    if(!name.trim() || name.trim().length > 50)
    {
        throw new AppError(400, "Invalid name..")
    }

    const foundTeam = await Team.findOne({
        _id: id,
        organizationId: req.user.organizationId._id
    })

    if(!foundTeam)
    {
        throw new AppError(404, "Team does not exist..")
    }

    foundTeam.isActive = true
    foundTeam.name = name

    await foundTeam.save()

    res
    .status(200)
    .json({
        message: "Team updated",
        data: foundTeam
    })
}

module.exports = {
    addTeam,
    getAllTeam,
    getTeamById,
    deleteTeam,
    updateTeam
}