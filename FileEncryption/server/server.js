const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { MongoClient } = require("mongodb");

const app = express();
const upload = multer({ dest: "uploads/" });
const port = 3000;

// MongoDB setup
const mongoURI = "mongodb://localhost:27017";
const dbName = "fileEncryption";
let db;

// Connect to MongoDB
MongoClient.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then((client) => {
        db = client.db(dbName);
        console.log("Connected to MongoDB");
    })
    .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use(cors());
app.use(bodyParser.json());

// Endpoint to fetch the secret key
app.get("/getKey", async (req, res) => {
    try {
        const keyDoc = await db.collection("keys").findOne({});
        if (!keyDoc) {
            return res.status(404).send("Secret key not found");
        }
        res.json({ secretKey: keyDoc.secretKey });
    } catch (err) {
        res.status(500).send("Error fetching secret key");
    }
});

// Upload encrypted file
app.post("/upload", upload.single("file"), (req, res) => {
    const { path: tempPath, originalname } = req.file;
    const targetPath = path.join(__dirname, "uploads", originalname);

    fs.rename(tempPath, targetPath, (err) => {
        if (err) {
            return res.status(500).send("Error saving file.");
        }
        res.json({
            message: "File uploaded successfully",
            fileName: originalname,
        });
    });
});

// Get encrypted file
app.get("/file/:filename", (req, res) => {
    const filePath = path.join(__dirname, "uploads", req.params.filename);

    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send("File not found.");
    }
});

app.listen(port, () =>
    console.log(`Server running at http://localhost:${port}`)
);
