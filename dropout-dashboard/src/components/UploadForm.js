import { useState } from 'react';
import { uploadFile } from '../api/api';
import { Button, Typography, Box, TextField, Alert } from '@mui/material';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await uploadFile(formData);
      setMessage(res.data.message);
      
      // Auto refresh page after successful upload
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      setMessage('Upload failed');
      console.error('Upload error:', error);
    }
  };

  return (
    <Box sx={{ my: 3, p: 3, border: '1px solid #ccc', borderRadius: 2, maxWidth: 500, margin: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Upload Student Data
      </Typography>
      <Button variant="contained" component="label">
        Select File
        <input type="file" accept=".csv" hidden onChange={handleFileChange} />
      </Button>
      {file && <Typography sx={{ mt: 1 }}>{file.name}</Typography>}
      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={handleUpload}>
          Upload
        </Button>
      </Box>
      {message && <Alert severity="info" sx={{ mt: 2 }}>{message}</Alert>}
    </Box>
  );
}

export default UploadForm;