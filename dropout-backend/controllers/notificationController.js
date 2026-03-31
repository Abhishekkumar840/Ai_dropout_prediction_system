const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const uploadController = require('./uploadController');

// Analyze student data and generate notifications
function analyzeStudentData(students) {
    const notifications = [];
    let notificationId = 1;

    // Count risk levels
    const riskCounts = {
        High: 0,
        Medium: 0,
        Low: 0
    };

    // Analyze each student
    const highRiskStudents = [];
    const lowAttendanceStudents = [];
    const highFeesStudents = [];

    students.forEach(student => {
        const risk = student['Dropout Risk'] || student['risk'];
        const attendance = parseFloat(student['Attendance %'] || student['attendance'] || 0);
        const fees = parseFloat(student['Fees Due'] || student['fees'] || 0);
        const name = student['Name'] || student['name'];

        // Count risks
        if (risk) riskCounts[risk] = (riskCounts[risk] || 0) + 1;

        // High risk students
        if (risk === 'High') {
            highRiskStudents.push(name);
        }

        // Low attendance (below 60%)
        if (attendance < 60 && attendance > 0) {
            lowAttendanceStudents.push({ name, attendance });
        }

        // High fees due (above 15000)
        if (fees > 15000) {
            highFeesStudents.push({ name, fees });
        }
    });

    // Generate notifications based on analysis
    
    // High Risk Students Alert
    if (riskCounts.High > 0) {
        notifications.push({
            id: notificationId++,
            message: `🚨 URGENT: ${riskCounts.High} students identified with HIGH dropout risk. Immediate intervention required!`,
            severity: "error",
            date_sent: new Date().toISOString(),
            priority: "high"
        });

        // Individual high-risk student alerts (limit to top 3)
        highRiskStudents.slice(0, 3).forEach(name => {
            notifications.push({
                id: notificationId++,
                message: `⚠️ Student "${name}" has HIGH dropout risk - Schedule counselling session immediately`,
                severity: "warning",
                date_sent: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString(),
                priority: "high"
            });
        });
    }

    // Medium Risk Alert
    if (riskCounts.Medium > 0) {
        notifications.push({
            id: notificationId++,
            message: `📊 ${riskCounts.Medium} students at MEDIUM risk. Monitor closely and provide support.`,
            severity: "warning",
            date_sent: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            priority: "medium"
        });
    }

    // Low Attendance Alert
    if (lowAttendanceStudents.length > 0) {
        notifications.push({
            id: notificationId++,
            message: `📉 ${lowAttendanceStudents.length} students have attendance below 60%. Contact parents immediately.`,
            severity: "warning",
            date_sent: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
            priority: "medium"
        });
    }

    // High Fees Due Alert
    if (highFeesStudents.length > 0) {
        notifications.push({
            id: notificationId++,
            message: `💰 ${highFeesStudents.length} students have pending fees above ₹15,000. Financial assistance needed.`,
            severity: "info",
            date_sent: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            priority: "medium"
        });
    }

    // Success message for safe students
    if (riskCounts.Low > 0) {
        notifications.push({
            id: notificationId++,
            message: `✅ Good news! ${riskCounts.Low} students are in SAFE zone with low dropout risk.`,
            severity: "success",
            date_sent: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            priority: "low"
        });
    }

    // Data upload confirmation
    notifications.unshift({
        id: notificationId++,
        message: `📁 New student data uploaded successfully! Analyzed ${students.length} students.`,
        severity: "info",
        date_sent: new Date().toISOString(),
        priority: "low"
    });

    return notifications;
}

exports.getAllNotifications = (req, res) => {
    console.log('🚀 Generating dynamic notifications based on student data');
    
    // Get latest uploaded file
    let filePath = uploadController.getLatestUploadedFile();
    
    // Fallback to default file
    if (!filePath || !fs.existsSync(filePath)) {
        filePath = path.join(__dirname, '..', 'ml_model', 'rajasthan_student_dataset.csv');
    }

    if (!fs.existsSync(filePath)) {
        // Return default notifications if no data
        return res.json([{
            id: 1,
            message: "📁 No student data found. Please upload a CSV file to generate notifications.",
            severity: "info",
            date_sent: new Date().toISOString()
        }]);
    }

    // Read and analyze student data
    const students = [];
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => students.push(data))
        .on('end', () => {
            const dynamicNotifications = analyzeStudentData(students);
            console.log(`📤 Generated ${dynamicNotifications.length} notifications`);
            res.json(dynamicNotifications);
        })
        .on('error', (err) => {
            console.error('Error reading student data for notifications:', err);
            res.status(500).json([{
                id: 1,
                message: "❌ Error analyzing student data for notifications",
                severity: "error",
                date_sent: new Date().toISOString()
            }]);
        });
};