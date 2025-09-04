import React, { useState } from 'react';
import axios from 'axios';
import { 
    Button, TextField, Card, Typography, Box, 
    Select, MenuItem, InputLabel, FormControl, FormLabel, RadioGroup, 
    FormControlLabel, Radio, CardContent, CardHeader, Alert,
    InputAdornment, Grid
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Importación añadida

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Helper para obtener la fecha en formato YYYY-MM-DD
const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function AddTransactionForm({ accounts, onTransactionAdded }) {
    const [accountId, setAccountId] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('expense');
    const [date, setDate] = useState(getTodayString());
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!accountId || !amount || !date) {
            setError('La cuenta, el monto y la fecha son obligatorios.');
            return;
        }

        try {
            const newTransaction = {
                account_id: parseInt(accountId),
                amount: parseFloat(amount),
                description: description,
                type: type,
                date: date
            };
            await axios.post(`${API_URL}/api/transactions/`, newTransaction);
            
            // Limpiar formulario
            setAccountId('');
            setAmount('');
            setDescription('');
            setDate(getTodayString());
            
            // Mostrar mensaje de éxito
            setSuccess('Transacción añadida exitosamente!');
            
            if (onTransactionAdded) {
                onTransactionAdded();
            }

            // Ocultar mensaje de éxito después de 3 segundos
            setTimeout(() => setSuccess(''), 3000);

        } catch (err) {
            setError('Ocurrió un error al crear la transacción.');
            console.error("Error al crear la transacción:", err);
        }
    };

    return (
        <Card elevation={2} sx={{ mb: 3 }}>
            <CardHeader 
                title="Añadir Transacción" 
                titleTypographyProps={{ variant: 'h6' }}
                avatar={<ReceiptIcon color="primary" />}
            />
            <CardContent>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <FormControl component="fieldset" margin="normal" fullWidth>
                        <FormLabel component="legend">Tipo de Transacción</FormLabel>
                        <RadioGroup row value={type} onChange={(e) => setType(e.target.value)}>
                            <FormControlLabel 
                                value="expense" 
                                control={<Radio />} 
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <RemoveIcon color="error" sx={{ mr: 0.5 }} />
                                        Gasto
                                    </Box>
                                } 
                            />
                            <FormControlLabel 
                                value="income" 
                                control={<Radio />} 
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <AddIcon color="success" sx={{ mr: 0.5 }} />
                                        Ingreso
                                    </Box>
                                } 
                            />
                        </RadioGroup>
                    </FormControl>

                    <FormControl fullWidth margin="normal" required>
                        <InputLabel>Cuenta</InputLabel>
                        <Select 
                            value={accountId} 
                            label="Cuenta" 
                            onChange={(e) => setAccountId(e.target.value)}
                        >
                            {accounts.map(acc => (
                                <MenuItem key={acc.id} value={acc.id}>
                                    {acc.name} (${acc.balance.toFixed(2)})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Descripción"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        autoComplete="off"
                    />

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Monto"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AttachMoneyIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Fecha"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required
                            />
                        </Grid>
                    </Grid>

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
                        startIcon={<ReceiptIcon />}
                    >
                        Añadir Transacción
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}

export default AddTransactionForm;