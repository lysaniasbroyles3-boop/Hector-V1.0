
async function runDiagnostics() {
    const button = document.getElementById("scanButton");
    const progress = document.getElementById("progressBar");
    const status = document.getElementById("scanStatus");

    button.disabled = true;
    progress.style.width = "0%";
    status.textContent = "Initializing diagnostic engine...";

    function updateProgress(amount, message) {
        progress.style.width = amount + "%";
        status.textContent = message;
    }

    try {
        updateProgress(15, "Inspecting processor...");

        const cpu = navigator.hardwareConcurrency || "Unavailable";
        document.getElementById("cpu").textContent = cpu;

        const ram = navigator.deviceMemory
            ? navigator.deviceMemory + " GB*"
            : "Unavailable";

        document.getElementById("ram").textContent = ram;

        updateProgress(30, "Inspecting graphics...");

        let gpu = "Not exposed";
        let gpuDetail = "Graphics identification unavailable";

        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl2") ||
                   canvas.getContext("webgl");

        if (gl) {
            const extension = gl.getExtension(
                "WEBGL_debug_renderer_info"
            );

            if (extension) {
                gpu = gl.getParameter(
                    extension.UNMASKED_RENDERER_WEBGL
                );

                gpuDetail = "Browser-reported graphics renderer";
            } else {
                gpu = "Graphics detected";
                gpuDetail = "Renderer name protected by browser";
            }
        } else {
            gpu = "Unavailable";
        }

        document.getElementById("gpu").textContent = gpu;
        document.getElementById("gpuDetail").textContent = gpuDetail;

        updateProgress(45, "Checking browser storage...");

        try {
            const storage = await navigator.storage.estimate();

            const used = storage.usage || 0;
            const quota = storage.quota || 0;

            document.getElementById("storage").textContent =
                quota ? (quota / 1073741824).toFixed(2) + " GB" : "Unknown";

            document.getElementById("storageDetail").textContent =
                quota
                    ? (used / 1048576).toFixed(1) +
                      " MB used in browser storage"
                    : "Storage estimate unavailable";
        } catch {
            document.getElementById("storage").textContent = "Unavailable";
        }

        updateProgress(60, "Testing network connection...");

        const connection =
            navigator.connection ||
            navigator.mozConnection ||
            navigator.webkitConnection;

        document.getElementById("network").textContent =
            navigator.onLine ? "Connected" : "Offline";

        document.getElementById("networkDetail").textContent =
            connection
                ? (connection.effectiveType || "Unknown") +
                  (connection.downlink
                    ? " · Estimated " + connection.downlink + " Mbps"
                    : "")
                : "Connection estimate unavailable";

        updateProgress(70, "Inspecting battery...");

        try {
            if (navigator.getBattery) {
                const battery = await navigator.getBattery();

                document.getElementById("battery").textContent =
                    Math.round(battery.level * 100) + "%";

                document.getElementById("batteryDetail").textContent =
                    battery.charging ? "Charging" : "Not charging";
            } else {
                document.getElementById("battery").textContent =
                    "Unavailable";

                document.getElementById("batteryDetail").textContent =
                    "Battery API not supported";
            }
        } catch {
            document.getElementById("battery").textContent =
                "Unavailable";
        }

        updateProgress(85, "Inspecting browser capabilities...");

        const ua = navigator.userAgent;

        let browser = "Unknown browser";

        if (ua.includes("Edg/")) {
            browser = "Microsoft Edge";
        } else if (ua.includes("OPR/")) {
            browser = "Opera";
        } else if (ua.includes("Firefox/")) {
            browser = "Mozilla Firefox";
        } else if (ua.includes("Chrome/")) {
            browser = "Google Chrome / Chromium";
        } else if (ua.includes("Safari/")) {
            browser = "Safari";
        }

        document.getElementById("browser").textContent = browser;

        document.getElementById("platform").textContent =
            navigator.userAgentData?.platform ||
            navigator.platform ||
            "Not exposed";

        document.getElementById("screen").textContent =
            screen.width + " × " + screen.height;

        document.getElementById("pixelRatio").textContent =
            window.devicePixelRatio;

        document.getElementById("webgpu").textContent =
            navigator.gpu ? "Available" : "Not available";

        document.getElementById("cookies").textContent =
            navigator.cookieEnabled ? "Enabled" : "Disabled";

        document.getElementById("touch").textContent =
            navigator.maxTouchPoints > 0 ? "Supported" : "Not detected";

        updateProgress(100, "Diagnostic scan complete!");

        document.getElementById("scanLabel").textContent =
            "SCAN COMPLETE";

    } catch (error) {
        status.textContent = "Scan encountered an error: " + error.message;
        console.error(error);
    } finally {
        button.disabled = false;
    }
}
