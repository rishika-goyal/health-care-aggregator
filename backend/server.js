const express = require("express")
const cors = require("cors")
const connectDB = require("./db")
const HealthLog = require("./models/HealthLog")

const app = express()

app.use(cors())
app.use(express.json())

connectDB()

app.get("/", (req, res) => {
    res.send("Health Aggregator Server Running")
})

app.get("/health", async (req, res) => {

    const memory = process.memoryUsage().rss / 1024 / 1024

    let memoryStatus = "Healthy"

    if (memory > 500) {
        memoryStatus = "Warning"
    }

    const overallStatus =
        memoryStatus === "Healthy"
            ? "OK"
            : "DEGRADED"

    const healthData = {
        overallStatus: overallStatus,
        memoryStatus: memoryStatus,
        uptime: process.uptime(),
        memoryUsage: memory.toFixed(2) + " MB",
        timestamp: new Date()
    }

    try {

        const log = new HealthLog(healthData)

        await log.save()

        res.json(healthData)

    } catch (error) {

        res.json({
            status: "ERROR"
        })

    }

})

app.get("/logs", async (req, res) => {

    try {

        const logs = await HealthLog
            .find()
            .sort({ timestamp: -1 })
            .limit(10)

        res.json(logs)

    } catch (error) {

        res.json({
            status: "ERROR"
        })

    }

})

const PORT = 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})