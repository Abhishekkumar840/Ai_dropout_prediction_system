import { Container, Typography, Box } from '@mui/material';
import { useState } from 'react';
import UploadForm from './components/UploadForm';
import Dashboard from './components/Dashboard';
import Notifications from './components/Notifications';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    // Trigger dashboard and notifications refresh
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* Main Content */}
      <Container sx={{ textAlign: 'center', mt: 4, pr: 45 }}> {/* Right padding for notifications */}
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          🎓 AI-Based Dropout Prediction Dashboard
        </Typography>
        
        <UploadForm onUploadSuccess={handleUploadSuccess} />
        <Dashboard key={refreshKey} />
      </Container>

      {/* Right Side Notifications */}
      <Notifications key={`notifications-${refreshKey}`} />
    </Box>
  );
}

export default App;