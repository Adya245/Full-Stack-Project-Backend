const express = require("express")
const {authorize} = require("../Middlewares/authorize")
const {isLoggedin} = require("../Middlewares/isLoggedin")

const {
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
    } = require("../Controllers/OwnerController")

const router = express.Router()

// Owner APIs for Organizations

router.post("/organization", isLoggedin, authorize("owner"), createOrgs)
router.get("/organization", isLoggedin, authorize("owner"), getAllOrgs)
router.get("/organization/:id", isLoggedin, authorize("owner"), getOrgById)
router.delete("/organization/:id", isLoggedin, authorize("owner"), deleteOrg)
router.patch("/organization/:id", isLoggedin, authorize("owner"), UpdateOrg)

//Owner APIs for Admin

router.post("/organization/:id/admin", isLoggedin, authorize("owner"), createAdmin)
router.get("/organization/:id/admin", isLoggedin, authorize("owner"), getAllAdmin)
router.get("/admin/:id", isLoggedin, authorize("owner"), getAdminById)
router.patch("/admin/:id", isLoggedin, authorize("owner"), activateAdmin)
router.delete("/admin/:id", isLoggedin, authorize("owner"), deactivateAdmin)

module.exports = {
    OwnerRouter : router
}