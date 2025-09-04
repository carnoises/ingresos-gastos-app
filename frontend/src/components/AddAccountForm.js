import React, { useState } from 'react';
import axios from 'axios';
import { 
    Button, TextField, Card, Typography, Box, CardContent, CardHeader,
    Alert, InputAdornment
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function AddAccountForm({ onAccountAdded }) {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('0');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

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
      
      // Mostrar mensaje de éxito
      setSuccess('Cuenta creada exitosamente!');
      
      // Notificar al componente padre que se añadió una cuenta para que refresque la lista
      if (onAccountAdded) {
        onAccountAdded();
      }

      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);

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
    <Card elevation={2} sx={{ mb: 3 }}>
      <CardHeader 
        title="Añadir Nueva Cuenta" 
        titleTypographyProps={{ variant: 'h6' }}
        avatar={<AccountBalanceIcon color="primary" />}
      />
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
            autoComplete="off"
          />
          <TextField
            label="Balance Inicial"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoneyIcon />
                </InputAdornment>
              ),
            }}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth
            sx={{ mt: 2 }}
            startIcon={<AccountBalanceIcon />}
          >
            Crear Cuenta
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AddAccountForm;