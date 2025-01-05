const publicVapidKey = "your-public-vapid-key"; // REPLACE_WITH_YOUR_KEY

// Check for service worker
if ("serviceWorker" in navigator) {
    send().catch((err) => console.error(err));
}

// Register SW, Register Push, Send Push
async function send() {
    // Register Service Worker
    console.log("Registering service worker...");
    const register = await navigator.serviceWorker.register("./sw.js", {
        scope: "/",
    });
    console.log("Service Worker Registered...");

    // Register Push
    console.log("Registering Push...");
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
    console.log("Push Registered...");

    // Send Push Notification
    console.log("Sending Push...");
    await fetch("http://localhost:3000/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
            "content-type": "application/json",
        },
    });
    console.log("Push Sent...");
}
function urlBase64ToUint8Array(base64String) {
    // Replace URL-safe characters with standard Base64 characters
    base64String = base64String.replace(/-/g, "+").replace(/_/g, "/");

    // Add padding if necessary
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = base64String + padding;

    try {
        const rawData = atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    } catch (e) {
        console.error("Failed to decode Base64 string:", e);
        return null;
    }
}
