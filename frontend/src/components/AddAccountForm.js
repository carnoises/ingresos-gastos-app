import React, { useState } from 'react';
import axios from 'axios';
import {
    Button, TextField, Card, Box, CardContent, CardHeader,
    Alert, InputAdornment, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function AddAccountForm({ onAccountAdded }) {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('0');
  const [accountType, setAccountType] = useState('Banco'); // Default to Banco
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
        balance: parseFloat(balance),
        type: accountType
      };
      await axios.post(`${API_URL}/api/accounts/`, newAccount);

      // Limpiar el formulario
      setName('');
      setBalance('0');
      setAccountType('Banco'); // Reset type as well

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
          <FormControl fullWidth margin="normal">
            <InputLabel id="account-type-label">Tipo de Cuenta</InputLabel>
            <Select
              labelId="account-type-label"
              id="account-type-select"
              value={accountType}
              label="Tipo de Cuenta"
              onChange={(e) => setAccountType(e.target.value)}
            >
              <MenuItem value="Banco">Banco</MenuItem>
              <MenuItem value="Efectivo">Efectivo</MenuItem>
              <MenuItem value="Tarjeta de Crédito">Tarjeta de Crédito</MenuItem>
              <MenuItem value="Inversión">Inversión</MenuItem>
              <MenuItem value="Ahorro">Ahorro</MenuItem>
            </Select>
          </FormControl>
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