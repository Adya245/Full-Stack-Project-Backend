require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cp = require("cookie-parser")
const {UserRouter} = require("./Routes/AuthenticationRoute")
// const {addUser} = require("../Utils/AddUser")
const cors = require("cors")
const { OwnerRouter } = require("./Routes/OwnerRoute")
const { AdminRouter } = require("./Routes/AdminRoute")
const app = express()


app.use(cors({
    credentials: true
}))
app.use(cp())
app.use(express.json())
app.use("/api/auth", UserRouter)
app.use("/api/owner", OwnerRouter)
app.use("/api/admin", AdminRouter)


mongoose.connect(process.env.DB_URL)
.then(() => {
    console.log("Database Connected")

    // addUser("Adya", "adya@gmail.com")

    const port = process.env.PORT || 8080

    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${port}`)
    })
})
.catch((error) => {
    console.log(`DB connection failed: ${error.message}`)
})



app.use((err, req, res, next) => {
    res.status(err.status || 400).json({
        message: err.message
    })
})