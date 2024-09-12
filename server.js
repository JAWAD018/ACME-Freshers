const express = require('express');
const cors = require('cors'); // Import the cors package
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// Enable CORS for all origins
app.use(cors());

// MongoDB connection setup
const url = 'mongodb+srv://mohmmedjawad36:Jawad52923@cluster0.v1odd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'qrDatabase';

const client = new MongoClient(url);

async function connectToDb() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('Error connecting to MongoDB Atlas:', err);
    }
}

connectToDb();

const db = client.db(dbName);
const usersCollection = db.collection('users');

// Define route
app.post('/check-qr', async (req, res) => {
    const { qrCode } = req.body;

    try {
        const user = await usersCollection.findOne({ qrCode });

        if (user) {
            res.json({
                success: true,
                photo: user.photo,
                name: user.name,
                email: user.email,
                qrCode: user.qrCode
            });
        } else {
            res.json({ success: false, message: 'QR code not found.' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
