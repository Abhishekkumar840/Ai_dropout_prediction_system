const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Store the latest uploaded file path
let latestUploadedFile = null;

exports.processFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const pythonScript = path.join(__dirname, '..', 'ml_model', 'predict.py');
    const filePath = req.file.path;
    
    // Store the latest uploaded file path
    latestUploadedFile = filePath;
    console.log('📁 New file uploaded:', filePath);

    const pythonProcess = spawn('python', [pythonScript, filePath]);

    let output = '';
    pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error('Python error:', data.toString());
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            try {
                const result = JSON.parse(output);
                res.json(result);
            } catch (error) {
                res.status(500).json({ message: 'Invalid response from Python script' });
            }
        } else {
            res.status(500).json({ message: 'Python script failed' });
        }
    });
};

// Export function to get latest uploaded file path
exports.getLatestUploadedFile = () => {
    return latestUploadedFile;
};