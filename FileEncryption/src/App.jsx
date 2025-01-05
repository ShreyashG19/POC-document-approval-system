import React, { useState, useEffect } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";

function App() {
    const [file, setFile] = useState(null);
    const [secretKey, setSecretKey] = useState("");
    const [encryptedFileName, setEncryptedFileName] = useState("");

    // Fetch secret key on component mount
    useEffect(() => {
        const fetchKey = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/getKey"
                );
                setSecretKey(response.data.secretKey);
            } catch (err) {
                alert("Failed to fetch secret key");
            }
        };

        fetchKey();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const encryptAndUpload = async () => {
        if (!file || !secretKey) {
            alert("Please select a file and ensure the secret key is loaded!");
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const fileData = e.target.result;

            // Encrypt the file data
            const encryptedData = CryptoJS.AES.encrypt(
                fileData,
                secretKey
            ).toString();
            const blob = new Blob([encryptedData], { type: "text/plain" });

            // Create a new FormData object and append the encrypted file
            const formData = new FormData();
            formData.append("file", new File([blob], file.name + ".enc"));

            // Upload the encrypted file
            try {
                const response = await axios.post(
                    "http://localhost:3000/upload",
                    formData
                );
                setEncryptedFileName(response.data.fileName);
                alert("File encrypted and uploaded successfully!");
            } catch (err) {
                alert("Error uploading file.");
            }
        };
        reader.readAsText(file);
    };

    const downloadAndDecrypt = async () => {
        if (!encryptedFileName || !secretKey) {
            alert("Please fetch a file and ensure the secret key is loaded!");
            return;
        }

        try {
            const response = await axios.get(
                `http://localhost:3000/file/${encryptedFileName}`,
                {
                    responseType: "blob",
                }
            );

            const reader = new FileReader();
            reader.onload = () => {
                const encryptedData = reader.result;

                // Decrypt the file data
                const decryptedData = CryptoJS.AES.decrypt(
                    encryptedData,
                    secretKey
                ).toString(CryptoJS.enc.Utf8);

                // Create a Blob from the decrypted data
                const blob = new Blob([decryptedData], {
                    type: "application/pdf",
                });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = file.name.replace(".enc", "");
                link.click();
            };
            reader.readAsText(response.data);
        } catch (err) {
            alert("Error downloading or decrypting the file.");
        }
    };

    return (
        <div>
            <h1>File Encryption and Decryption</h1>
            {secretKey ? (
                <p>Secret key loaded: {secretKey}</p>
            ) : (
                <p>Loading secret key...</p>
            )}
            <div>
                <input type="file" onChange={handleFileChange} />
                <button onClick={encryptAndUpload}>Encrypt & Upload</button>
            </div>
            <div>
                <button onClick={downloadAndDecrypt}>Download & Decrypt</button>
            </div>
        </div>
    );
}

export default App;
