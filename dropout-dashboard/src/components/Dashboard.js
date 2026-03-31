import { useEffect, useState } from 'react';
import { getStudents } from '../api/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Chip } from '@mui/material';

function Dashboard() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    getStudents().then((res) => {
      setStudents(res.data);
    });
  }, []);

  const getColor = (risk) => {
    if (risk === 'High') return 'error';
    if (risk === 'Medium') return 'warning';
    return 'success';
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 3, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Student Risk Dashboard
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Attendance (%)</TableCell>
            <TableCell>Score</TableCell>
            <TableCell>Risk Level</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.attendance}</TableCell>
              <TableCell>{s.score}</TableCell>
              <TableCell>
                <Chip label={s.risk} color={getColor(s.risk)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Dashboard;
