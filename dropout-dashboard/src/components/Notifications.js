import { useEffect, useState } from 'react';
import { getNotifications } from '../api/api';
import { Typography, Box, Alert, Paper } from '@mui/material';

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotifications().then((res) => setNotifications(res.data));
  }, []);

  return (
    <Box 
      sx={{ 
        position: 'fixed', // Fixed position for right side
        top: 120, // Top spacing
        right: 20, // Right side positioning
        width: 350, // Fixed width
        maxHeight: '70vh', // Max height
        overflowY: 'auto', // Scroll if content exceeds
        zIndex: 1000, // Above other content
        backgroundColor: 'transparent'
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
        🔔 Notifications
      </Typography>
      
      {notifications.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No notifications yet
        </Alert>
      )}
      
      {notifications.map((n) => (
        <Paper 
          key={n.id} 
          elevation={3}
          sx={{ 
            p: 2, 
            mb: 2,
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            backgroundColor: 'background.paper'
          }}
        >
          <Alert 
            severity={n.severity || "warning"} 
            sx={{ 
              '& .MuiAlert-message': { 
                fontSize: '0.875rem' 
              }
            }}
          >
            {n.message}
          </Alert>
          <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
            📅 {new Date(n.date_sent).toLocaleString()}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}

export default Notifications;