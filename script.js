
/* ==========================================
   HECTOR 2.1 - DEVICE INTELLIGENCE ENGINE
========================================== */

const HECTOR_API_URL = "https://hector-ai-ub0n.onrender.com";

/* PAGE NAVIGATION */

function showPage(pageId, button) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.querySelectorAll(".nav-btn").forEach(nav => {
        nav.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if (page) page.classList.add("active");
    if (button) button.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (pageId === "ai") {
        checkHectorConnection();
    }
}

/* SAFE INFORMATION DISPLAY */

function setInfo(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}

function readableBytes(bytes) {
    if (bytes === undefined || bytes === null) return "Unknown";

    const gb = bytes / 1073741824;

    if (gb >= 1) return gb.toFixed(2) + " GB";

    return (bytes / 1048576).toFixed(2) + " MB";
}

/* ==========================================
   MAIN DIAGNOSTIC SCANNER
========================================== */

async function runDiagnostics() {

    const button = document.getElementById("scanButton");
    const progress = document.getElementById("progressBar");
    const status = document.getElementById("scanStatus");

    if (button) button.disabled = true;

    function updateProgress(amount, message) {
        if (progress) progress.style.width = amount + "%";
        if (status) status.textContent = message;
    }

    try {

        updateProgress(5, "Initializing HECTOR diagnostic engine...");

        /* PAGE 1 - SYSTEM */

        updateProgress(15, "Inspecting processor...");

        const cpu = navigator.hardwareConcurrency || "Unavailable";

        setInfo("cpu", cpu + (typeof cpu === "number" ? " Threads" : ""));

        const ram = navigator.deviceMemory
            ? navigator.deviceMemory + " GB (approx.)"
            : "Not exposed by browser";

        setInfo("ram", ram);
        setInfo("ramDetail", ram);

        setInfo(
            "platform",
            navigator.userAgentData?.platform ||
            navigator.platform ||
            "Not exposed"
        );

        setInfo("screen", screen.width + " × " + screen.height + " pixels");
        setInfo("pixelRatio", window.devicePixelRatio || "Unknown");

        setInfo(
            "touch",
            navigator.maxTouchPoints > 0 ? "Supported" : "Not detected"
        );

        setInfo("colorDepth", screen.colorDepth + " bits");

        /* GRAPHICS */

        updateProgress(25, "Analyzing graphics hardware...");

        let gpuName = "Not exposed";
        let gpuDetails = "Graphics identification unavailable";
        let graphicsAvailable = false;

        const canvas = document.createElement("canvas");

        const gl =
            canvas.getContext("webgl2") ||
            canvas.getContext("webgl");

        if (gl) {
            graphicsAvailable = true;

            const extension = gl.getExtension("WEBGL_debug_renderer_info");

            if (extension) {
                gpuName = gl.getParameter(
                    extension.UNMASKED_RENDERER_WEBGL
                );

                gpuDetails = "Browser-reported graphics renderer";
            } else {
                gpuName = "Graphics detected";
                gpuDetails = "Renderer name protected by browser";
            }
        } else {
            gpuName = "Not detected";
        }

        setInfo("gpu", gpuName);
        setInfo("gpuDetail", gpuDetails);

        setInfo(
            "graphicsTest",
            graphicsAvailable ? "Graphics detected" : "Unavailable"
        );

        /* BATTERY */

        updateProgress(35, "Inspecting battery system...");

        try {
            if (navigator.getBattery) {

                const battery = await navigator.getBattery();

                setInfo("battery", Math.round(battery.level * 100) + "%");

                setInfo(
                    "batteryDetail",
                    battery.charging ? "Currently charging" : "Not charging"
                );

                setInfo("batteryTest", "Battery information detected");

            } else {
                setInfo("battery", "Unavailable");
                setInfo("batteryDetail", "Battery API not supported");
                setInfo("batteryTest", "Not exposed");
            }
        } catch {
            setInfo("battery", "Unavailable");
            setInfo("batteryDetail", "Access restricted");
            setInfo("batteryTest", "Unavailable");
        }

        /* PAGE 2 - BROWSER */

        updateProgress(45, "Inspecting browser...");

        const ua = navigator.userAgent;

        let browserName = "Unknown browser";
        let browserVersion = "Not identified";

        if (ua.includes("Edg/")) {
            browserName = "Microsoft Edge";
            browserVersion = ua.match(/Edg\/([\d.]+)/)?.[1] || "Unknown";

        } else if (ua.includes("OPR/")) {
            browserName = "Opera";
            browserVersion = ua.match(/OPR\/([\d.]+)/)?.[1] || "Unknown";

        } else if (ua.includes("Firefox/")) {
            browserName = "Mozilla Firefox";
            browserVersion = ua.match(/Firefox\/([\d.]+)/)?.[1] || "Unknown";

        } else if (ua.includes("Chrome/")) {
            browserName = "Google Chrome / Chromium";
            browserVersion = ua.match(/Chrome\/([\d.]+)/)?.[1] || "Unknown";

        } else if (ua.includes("Safari/")) {
            browserName = "Safari";
            browserVersion = ua.match(/Version\/([\d.]+)/)?.[1] || "Unknown";
        }

        if (navigator.userAgentData) {
            try {
                const details =
                    await navigator.userAgentData.getHighEntropyValues([
                        "fullVersionList",
                        "platformVersion",
                        "architecture",
                        "bitness",
                        "model"
                    ]);

                const chromeBrand = details.fullVersionList?.find(
                    item => item.brand.includes("Chrome")
                );

                if (chromeBrand) {
                    browserVersion = chromeBrand.version;
                }

                setInfo(
                    "browserPlatform",
                    details.platform || navigator.userAgentData.platform
                );

                setInfo("browserArchitecture", details.architecture || "Not exposed");
                setInfo("browserBitness", details.bitness || "Not exposed");
                setInfo("browserModel", details.model || "Not exposed");
                setInfo("platformVersion", details.platformVersion || "Not exposed");

            } catch {
                setInfo("browserArchitecture", "Not exposed");
                setInfo("browserBitness", "Not exposed");
                setInfo("browserModel", "Not exposed");
                setInfo("platformVersion", "Not exposed");
            }
        } else {
            setInfo("browserArchitecture", "Not exposed");
            setInfo("browserBitness", "Not exposed");
            setInfo("browserModel", "Not exposed");
            setInfo("platformVersion", "Not exposed");
        }

        setInfo("browserName", browserName);
        setInfo("browserVersion", browserVersion);
        setInfo("userAgent", ua);

        setInfo(
            "browserPlatform",
            navigator.userAgentData?.platform ||
            navigator.platform ||
            "Not exposed"
        );

        setInfo("language", navigator.language || "Unknown");
        setInfo("onlineStatus", navigator.onLine ? "Online" : "Offline");
        setInfo("cookies", navigator.cookieEnabled ? "Enabled" : "Disabled");
        setInfo("javascript", "Enabled");
        setInfo("doNotTrack", navigator.doNotTrack || "Not specified");

        /* BROWSER CAPABILITIES */

        updateProgress(55, "Testing browser technologies...");

        setInfo("webgpu", navigator.gpu ? "Available" : "Not available");
        setInfo("webgl", gl ? "Supported" : "Not supported");

        setInfo(
            "serviceWorker",
            "serviceWorker" in navigator ? "Supported" : "Unavailable"
        );

        setInfo(
            "wasm",
            typeof WebAssembly !== "undefined" ? "Supported" : "Unavailable"
        );

        let storageAvailable = false;

        try {
            const testKey = "__hector_test__";
            localStorage.setItem(testKey, "test");
            localStorage.removeItem(testKey);
            storageAvailable = true;
        } catch {
            storageAvailable = false;
        }

        setInfo("localStorage", storageAvailable ? "Available" : "Restricted");

        setInfo(
            "webrtc",
            window.RTCPeerConnection ? "Supported" : "Unavailable"
        );

        setInfo(
            "windowSize",
            window.innerWidth + " × " + window.innerHeight
        );

        setInfo(
            "availableScreen",
            screen.availWidth + " × " + screen.availHeight
        );

        setInfo(
            "colorScheme",
            matchMedia("(prefers-color-scheme: dark)").matches
                ? "Dark"
                : "Light"
        );

        /* PAGE 3 - NETWORK */

        updateProgress(70, "Analyzing network connection...");

        const connection =
            navigator.connection ||
            navigator.mozConnection ||
            navigator.webkitConnection;

        const online = navigator.onLine;

        setInfo("network", online ? "Connected" : "Offline");

        setInfo(
            "networkDetail",
            connection
                ? connection.effectiveType || "Connection detected"
                : "Connection details restricted"
        );

        setInfo("internetStatus", online ? "Browser reports online" : "Offline");

        setInfo(
            "networkType",
            connection?.type ||
            connection?.effectiveType ||
            "Not exposed"
        );

        setInfo("connectionType", connection?.effectiveType || "Unknown");

        setInfo(
            "downloadSpeed",
            connection?.downlink
                ? connection.downlink + " Mbps (estimate)"
                : "Not exposed"
        );

        setInfo(
            "latency",
            connection?.rtt
                ? connection.rtt + " ms (estimate)"
                : "Not exposed"
        );

        setInfo("networkTest", online ? "Browser reports online" : "Offline");

        /* STORAGE */

        updateProgress(82, "Inspecting browser storage...");

        try {
            if (navigator.storage?.estimate) {

                const storage = await navigator.storage.estimate();

                const used = storage.usage || 0;
                const quota = storage.quota || 0;
                const available = Math.max(0, quota - used);

                setInfo("storage", quota ? readableBytes(quota) : "Unknown");
                setInfo("storageDetail", readableBytes(used) + " used");
                setInfo("storageQuota", readableBytes(quota));
                setInfo("storageUsed", readableBytes(used));
                setInfo("storageAvailable", readableBytes(available));

                setInfo(
                    "storageTest",
                    quota ? "Storage detected" : "Unavailable"
                );

            } else {
                setInfo("storage", "Unavailable");
                setInfo("storageDetail", "Storage API unavailable");
                setInfo("storageQuota", "Unavailable");
                setInfo("storageUsed", "Unavailable");
                setInfo("storageAvailable", "Unavailable");
                setInfo("storageTest", "Unavailable");
            }

        } catch {
            setInfo("storage", "Unavailable");
            setInfo("storageDetail", "Access restricted");
            setInfo("storageTest", "Unavailable");
        }

        try {
            if (navigator.storage?.persisted) {
                const persistent = await navigator.storage.persisted();

                setInfo(
                    "persistentStorage",
                    persistent ? "Granted" : "Not granted"
                );
            } else {
                setInfo("persistentStorage", "Not supported");
            }
        } catch {
            setInfo("persistentStorage", "Unavailable");
        }

        updateProgress(100, "HECTOR diagnostic scan complete!");
        setInfo("scanLabel", "SCAN COMPLETE");

    } catch (error) {

        updateProgress(100, "Diagnostic error: " + error.message);
        console.error("HECTOR diagnostic error:", error);

    } finally {

        if (button) button.disabled = false;

    }
}

/* ==========================================
   HECTOR AI - BACKEND CONNECTION
========================================== */

async function checkHectorConnection() {

    const status = document.getElementById("hectorConnection");

    if (status) {
        status.textContent = "CHECKING CONNECTION...";
        status.className = "ai-status";
    }

    try {
        const response = await fetch(
            HECTOR_API_URL + "/api/health"
        );

        if (!response.ok) {
            throw new Error("Backend returned an error");
        }

        const data = await response.json();

        if (data.status !== "online") {
            throw new Error("Backend is not reporting online");
        }

        if (status) {
            status.textContent = "● BACKEND ONLINE";
            status.className = "ai-status online";
        }

        return true;

    } catch (error) {

        if (status) {
            status.textContent = "● BACKEND OFFLINE";
            status.className = "ai-status offline";
        }

        console.error("HECTOR connection problem:", error);
        return false;
    }
}

/* ==========================================
   HECTOR AI - CHAT MESSAGES
========================================== */

function addHectorMessage(message, sender) {

    const chat = document.getElementById("aiChat");

    if (!chat) return;

    const messageElement = document.createElement("div");

    messageElement.className =
        sender === "user" ? "ai-message user" : "ai-message bot";

    messageElement.textContent = message;

    chat.appendChild(messageElement);

    chat.scrollTop = chat.scrollHeight;
}

/* SEND A MESSAGE TO HECTOR */

async function sendHectorMessage(event) {

    event.preventDefault();

    const input = document.getElementById("aiInput");
    const sendButton = document.getElementById("aiSendButton");
    const statusMessage = document.getElementById("aiStatusMessage");

    const message = input.value.trim();

    if (!message || sendButton.disabled) return;

    addHectorMessage(message, "user");

    input.value = "";
    sendButton.disabled = true;

    if (statusMessage) {
        statusMessage.textContent = "HECTOR is processing your message...";
    }

    try {

        const response = await fetch(
            HECTOR_API_URL + "/api/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: message
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Message request failed");
        }

        addHectorMessage(
            data.reply || "HECTOR received your message.",
            "bot"
        );

        if (statusMessage) {
            statusMessage.textContent = "Message received by HECTOR's backend.";
        }

    } catch (error) {

        addHectorMessage(
            "I couldn't reach my backend. Please check the connection and try again.",
            "bot"
        );

        if (statusMessage) {
            statusMessage.textContent = "Connection error: " + error.message;
        }

        checkHectorConnection();

    } finally {

        sendButton.disabled = false;
        input.focus();

    }
}

/* ==========================================
   STARTUP
========================================== */

window.addEventListener("load", () => {

    console.log("HECTOR 2.1 initialized.");

    const aiForm = document.getElementById("aiForm");

    if (aiForm) {
        aiForm.addEventListener("submit", sendHectorMessage);
    }

    checkHectorConnection();

});


