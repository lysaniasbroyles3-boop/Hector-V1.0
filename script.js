
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
        version: "2.0",
        message: "HECTOR's brain is running!"
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "online",
        system: "HECTOR AI",
        version: "2.0"
    });
});

function hectorBrain(message) {
    const text = message.toLowerCase().trim();

    if (/^(hi|hello|hey)\b/.test(text)) {
        return "Hello! I'm HECTOR, your device intelligence assistant. What would you like to explore today?";
    }

    if (text.includes("who are you")) {
        return "I'm HECTOR! I help with device information, technology, troubleshooting, and learning.";
    }

    if (text.includes("what can you do")) {
        return "I can help explain technology, troubleshoot browser problems, discuss device diagnostics, and answer questions using my built-in knowledge.";
    }

    if (text.includes("computer") || text.includes("chromebook")) {
        return "Chromebooks use ChromeOS and are designed around web applications. I can help you understand browser features, memory estimates, graphics support, and connectivity.";
    }

    if (text.includes("internet") || text.includes("network") || text.includes("wifi")) {
        return "Let's investigate your connection! HECTOR can check whether your browser reports that you're online and display available connection information.";
    }

    if (text.includes("cpu") || text.includes("processor")) {
        return "Your CPU is the processor that performs calculations and runs programs. HECTOR can report the logical processor count exposed by your browser.";
    }

    if (text.includes("ram") || text.includes("memory")) {
        return "RAM is temporary working memory used by applications. Browser-reported memory information is only an estimate and may be restricted.";
    }

    if (text.includes("gpu") || text.includes("graphics")) {
        return "Your GPU handles graphics and visual calculations. HECTOR can check browser graphics support and sometimes identify the graphics renderer.";
    }

    if (text.includes("help")) {
        return "I'm here to help! Try asking me about your Chromebook, processor, RAM, graphics, browser, or internet connection.";
    }

    if (text.includes("thank")) {
        return "You're welcome! HECTOR is ready for another question.";
    }

    if (text.includes("bye")) {
        return "Goodbye! HECTOR will be here when you return.";
    }

    return "That's an interesting question! My current built-in knowledge is limited, but I can help with technology, Chromebooks, browser features, and device diagnostics. A connected language model will be needed for broader AI conversations.";
}

app.post("/api/chat", (req, res) => {
    const message = req.body.message;

    if (!message || typeof message !== "string") {
        return res.status(400).json({
            error: "Please provide a message."
        });
    }

    if (message.length > 1000) {
        return res.status(400).json({
            error: "Message is too long."
        });
    }

    res.json({
        reply: hectorBrain(message),
        system: "HECTOR BUILT-IN BRAIN",
        status: "success"
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log("HECTOR AI 2.0 running on port " + PORT);
});



