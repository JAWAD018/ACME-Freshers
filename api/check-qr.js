import fs from 'fs';
import path from 'path';

// Load JSON data (Vercel serverless functions run in a stateless environment)
const dataFilePath = path.join(process.cwd(), 'data.json');
let data = [];

const loadData = () => {
    try {
        const jsonData = fs.readFileSync(dataFilePath, 'utf8');
        data = JSON.parse(jsonData);
        console.log('Data loaded from JSON file');
    } catch (err) {
        console.error('Error reading or parsing JSON file:', err);
    }
};

loadData();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { qrCode } = req.body;

        // Ensure the data is loaded
        if (data.length === 0) {
            loadData();
        }

        const item = data.find(d => d.qrCode === qrCode);

        if (item) {
            res.status(200).json({
                success: true,
                qrCode: item.qrCode,
                name: item.name,
                email: item.email,
                photo: item.photoUrl
            });
        } else {
            res.status(404).json({ success: false, message: 'QR code not found.' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
