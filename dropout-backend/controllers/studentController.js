const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const uploadController = require('./uploadController');

exports.getAllStudents = (req, res) => {
    const results = [];
    
    // Try to get latest uploaded file first
    let filePath = uploadController.getLatestUploadedFile();
    
    // Fallback to default file if no upload
    if (!filePath || !fs.existsSync(filePath)) {
        filePath = path.join(__dirname, '..', 'ml_model', 'rajasthan_student_dataset.csv');
        console.log('📂 Using default file:', filePath);
    } else {
        console.log('📁 Using uploaded file:', filePath);
    }

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'No data file found. Please upload a CSV file first.' });
    }

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
            // Map CSV fields to frontend expected format
            const mappedData = {
                id: data['Roll No'] || data['Registration No'] || data['id'],
                name: data['Name'] || data['name'],
                attendance: data['Attendance %'] || data['attendance'],
                score: data['Grade %'] || data['score'] || data['Grade'],
                risk: data['Dropout Risk'] || data['risk'] || data['Risk']
            };
            results.push(mappedData);
        })
        .on('end', () => {
            console.log(`✅ Loaded ${results.length} students from file`);
            res.json(results);
        })
        .on('error', (err) => {
            console.error('CSV file error:', err);
            res.status(500).json({ message: 'Error reading CSV file' });
        });
};