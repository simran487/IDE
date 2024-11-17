console.log("Server file is running...");

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use(cors({
    origin: 'http://127.0.0.1:5500', // Change this to your frontend URL
}));


// Judge0 API Configuration
const JUDGE0_URL = 'https://judge0-ce.p.rapidapi.com/submissions';
const RAPIDAPI_KEY = '0346fbc812msh279650e10be6579p11d8fdjsn3a779088dcb0'; // Replace with your Judge0 RapidAPI key
const RAPIDAPI_HOST = 'judge0-ce.p.rapidapi.com';

// Compile Code Route
app.post('/compile', async (req, res) => {
    const { language, code, stdin } = req.body;

    const langMap = {
        python: 71,
        c: 50,
        cpp: 54,
        java: 62,
    };

    if (!langMap[language]) {
        return res.status(400).json({ error: "Unsupported language" });
    }

    try {
        const response = await axios.post(
            `${JUDGE0_URL}?base64_encoded=false&wait=true`,
            {
                source_code: code,
                stdin: stdin || '',
                language_id: langMap[language],
            },
            {
                headers: {
                    'X-RapidAPI-Key': RAPIDAPI_KEY,
                    'X-RapidAPI-Host': RAPIDAPI_HOST,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.json({
            output: response.data.stdout || "No output",
            error: response.data.stderr || "",
            status: response.data.status.description,
        });
    } catch (error) {
        console.error("Compilation error:", error.message);
        res.status(500).send({ error: "Server error" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});








