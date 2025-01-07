const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

const app = express();
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
const serviceAccount = require("./fcmtest-7be5a-firebase-adminsdk-ll7i0-4214f79128.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Route to send push notification
app.get("/sendHello", async (req, res) => {
    const registrationToken = req.body.token; // Token from the Android app

    const message = {
        notification: {
            title: "Hello",
            body: "You've received a notification!",
        },
        token: registrationToken,
    };

    try {
        await admin.messaging().send(message);
        res.status(200).send("Notification sent!");
    } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).send("Failed to send notification.");
    }
});

// Start the server use "npm run dev"
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
