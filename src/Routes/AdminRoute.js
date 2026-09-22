const express = require("express")
const {authorize, isLoggedin, isOrganizationActive} = require("../Middlewares/Index")
const { addTeam,
        getAllTeam,
        getTeamById,
        deleteTeam,
        updateTeam
} = require("../Controllers/AdminController")


const router = express.Router()

router.post("/teams", isLoggedin, isOrganizationActive, authorize("admin"), addTeam)
router.get("/teams", isLoggedin, isOrganizationActive, authorize("admin"), getAllTeam)
router.get("/teams/:id", isLoggedin, isOrganizationActive, authorize("admin"), getTeamById)
router.delete("/teams/:id", isLoggedin, isOrganizationActive, authorize("admin"), deleteTeam)
router.patch("/teams/:id", isLoggedin, isOrganizationActive, authorize("admin"), updateTeam)


module.exports = {
    AdminRouter : router
}