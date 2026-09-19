const express = require("express")
const {authorize} = require("../Middlewares/authorize")
const {isLoggedin} = require("../Middlewares/isLoggedin")
const mongoose = require("mongoose")
const {createOrgs, getAllOrgs, getOrgById, deleteOrg, UpdateOrg} = require("../Controllers/OwnerController")


const router = express.Router()

router.post("/organization", isLoggedin, authorize("owner"), createOrgs)

router.get("/organization", isLoggedin, authorize("owner"), getAllOrgs)

router.get("/organization/:id", isLoggedin, authorize("owner"), getOrgById)

router.delete("/organization/:id", isLoggedin, authorize("owner"), deleteOrg)

router.patch("/organization/:id", isLoggedin, authorize("owner"), UpdateOrg)


module.exports = {
    OwnerRouter : router
}