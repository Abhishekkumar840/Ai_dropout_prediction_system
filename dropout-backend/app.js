const express = require('express');
const cors = require('cors');
const app = express();

const uploadRoutes = require('./routes/uploadRoutes');
const studentRoutes = require('./routes/studentRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); // नया route added
console.log('✅ Notification routes loaded'); 
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads')); // Static file serving
app.use('/api/upload', uploadRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/notifications', notificationRoutes); // नया endpoint added
console.log('✅ Notification endpoin'); 

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// const config = require('./config');
// const PORT = config.port;