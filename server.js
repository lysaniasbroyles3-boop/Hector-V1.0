
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        name: "HECTOR AI",
        status: "ONLINE",
        message: "HECTOR's brain is running!"
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "online",
        system: "HECTOR AI",
        version: "1.0.0"
    });
});

app.post("/api/chat", (req, res) => {
    const message = req.body.message;

    if (!message || typeof message !== "string") {
        return res.status(400).json({
            error: "Please provide a message."
        });
    }

    res.json({
        reply: "HECTOR received your message: " + message +
        ". My AI connection is not configured yet, but my backend is working!"
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log("HECTOR AI backend running on port " + PORT);
});
