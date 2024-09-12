const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// Enable CORS for all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST']
}));

// Load JSON data
const dataFilePath = path.join(__dirname, 'data.json');
let data = [];

fs.readFile(dataFilePath, 'utf8', (err, jsonData) => {
    if (err) {
        console.error('Error reading JSON file:', err);
        return;
    }
    try {
        data = JSON.parse(jsonData);
        console.log('Data loaded from JSON file');
    } catch (err) {
        console.error('Error parsing JSON data:', err);
    }
});

// Define route
app.post('/api/check-qr', (req, res) => {
    const { qrCode } = req.body;

    const item = data.find(d => d.qrCode === qrCode);

    if (item) {
        res.json({
            success: true,
            qrCode: item.qrCode,
            name: item.name,
            email: item.email,
            photo: item.photoUrl
        });
    } else {
        res.json({ success: false, message: 'QR code not found.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
