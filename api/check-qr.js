const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        // Load JSON data
        const dataFilePath = path.join(process.cwd(), 'data.json');
        let data = [];
        
        try {
            const jsonData = fs.readFileSync(dataFilePath, 'utf8');
            data = JSON.parse(jsonData);
        } catch (err) {
            console.error('Error reading or parsing JSON file:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        const { qrCode } = req.body;
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
};
