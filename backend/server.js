const express = require("express")
const cors = require("cors")
const connectDB = require("./db")

const app = express()

app.use(cors())
app.use(express.json())

connectDB()

app.get("/", (req, res) => {
    res.send("Health Aggregator Server Running")
})

app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date()
    })
})

const PORT = 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})