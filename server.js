import express from "express"
import { callAgent } from "./agent.js"

const app = express()
app.use(express.json())
app.use(express.static("public"))

app.post("/api/chat", async(req, res) => {
    try {
        const { message, userid } = req.body

        const result = await callAgent(message, userid)

        res.json({ response: result })
    } catch (error) {
        console.error("Server Error:", error)
        res.status(500).json({ response: "The server encountered an error." })
    }
})

app.listen(3000, () => console.log("Server started on http://localhost:3000"))