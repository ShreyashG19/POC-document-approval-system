import React, { useState } from "react";
import CryptoJS from "crypto-js";

function App() {
    const [pdfFile, setPdfFile] = useState(null);
    const [encryptedFile, setEncryptedFile] = useState(null);
    const [decryptedFile, setDecryptedFile] = useState(null);
    const [encryptionKey, setEncryptionKey] = useState("");
    const [decryptionFile, setDecryptionFile] = useState(null);
    const [decryptionKey, setDecryptionKey] = useState("");

    // Handle file input change for encryption (ensure PDF file)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setPdfFile(file);
        } else {
            alert("Please select a valid PDF file.");
        }
    };

    // Handle file input change for decryption (ensure PDF file)
    const handleDecryptionFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "text/plain") {
            setDecryptionFile(file);
        } else {
            alert("Please select a valid encrypted file.");
        }
    };

    // Convert PDF file to Base64 string
    const convertPdfToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(",")[1]); // Extract Base64 string
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // Handle encryption
    const encryptFile = async () => {
        if (!pdfFile || !encryptionKey) return;

        const base64String = await convertPdfToBase64(pdfFile);
        const encryptedContent = CryptoJS.AES.encrypt(
            base64String,
            encryptionKey
        ).toString();
        const encryptedBlob = new Blob([encryptedContent], {
            type: "text/plain",
        });
        const encryptedUrl = URL.createObjectURL(encryptedBlob);
        setEncryptedFile(encryptedUrl);
    };

    // Handle decryption
    const decryptFile = async () => {
        if (!decryptionFile || !decryptionKey) return;

        const reader = new FileReader();
        reader.onload = () => {
            const encryptedContent = reader.result;
            const bytes = CryptoJS.AES.decrypt(encryptedContent, decryptionKey);
            const decryptedBase64String = bytes.toString(CryptoJS.enc.Utf8);

            // Convert the decrypted Base64 string back to binary data (PDF)
            const byteArray = new Uint8Array(
                atob(decryptedBase64String)
                    .split("")
                    .map((c) => c.charCodeAt(0))
            );
            const decryptedBlob = new Blob([byteArray], {
                type: "application/pdf",
            });
            const decryptedUrl = URL.createObjectURL(decryptedBlob);
            setDecryptedFile(decryptedUrl);
        };
        reader.readAsText(decryptionFile); // Read the encrypted file as text
    };

    return (
        <div className="App">
            <h1>PDF Encryption and Decryption</h1>

            {/* Encryption Section */}
            <div>
                <h2>Encrypt PDF</h2>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                />
                <br />
                <input
                    type="password"
                    placeholder="Enter Encryption Key"
                    value={encryptionKey}
                    onChange={(e) => setEncryptionKey(e.target.value)}
                />
                <br />
                <button onClick={encryptFile}>Encrypt PDF</button>
                <br />
                {encryptedFile && (
                    <div>
                        <a href={encryptedFile} download="encrypted.txt">
                            Download Encrypted File
                        </a>
                    </div>
                )}
            </div>

            <br />

            {/* Decryption Section */}
            <div>
                <h2>Decrypt PDF</h2>
                <input
                    type="file"
                    accept="text/plain"
                    onChange={handleDecryptionFileChange}
                />
                <br />
                <input
                    type="password"
                    placeholder="Enter Decryption Key"
                    value={decryptionKey}
                    onChange={(e) => setDecryptionKey(e.target.value)}
                />
                <br />
                <button onClick={decryptFile}>Decrypt PDF</button>
                <br />
                {decryptedFile && (
                    <div>
                        <a href={decryptedFile} download="decrypted.pdf">
                            Download Decrypted PDF
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
