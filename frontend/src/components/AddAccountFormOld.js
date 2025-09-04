import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Card, Typography, Box, CardContent, CardHeader } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'https://ingresos-gastos-backend.onrender.com';

function AddAccountForm({ onAccountAdded }) {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('0');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('El nombre de la cuenta es obligatorio.');
      return;
    }

    try {
      const newAccount = {
        name: name,
        balance: parseFloat(balance)
      };
      await axios.post(`${API_URL}/api/accounts/`, newAccount);
      
      // Limpiar el formulario
      setName('');
      setBalance('0');
      
      // Notificar al componente padre que se añadió una cuenta para que refresque la lista
      if (onAccountAdded) {
        onAccountAdded();
      }

    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Ocurrió un error al crear la cuenta.');
      }
      console.error("Error al crear la cuenta:", err);
    }
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader title="Añadir Nueva Cuenta" titleTypographyProps={{ variant: 'h5' }} />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Nombre de la Cuenta"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Balance Inicial"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
          />
          {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Crear Cuenta
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AddAccountForm;
