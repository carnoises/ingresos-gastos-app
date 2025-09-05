import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button, TextField, Card, Box, CardContent, CardHeader,
    Alert, InputAdornment, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'; // This will be replaced by the Render URL

function AddTransferForm({ onTransferCompleted }) {
    const [fromAccount, setFromAccount] = useState('');
    const [toAccount, setToAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/accounts/`);
            setAccounts(response.data);
        } catch (err) {
            console.error("Error al cargar cuentas:", err);
            setError('Error al cargar las cuentas disponibles.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!fromAccount || !toAccount || !amount) {
            setError('Por favor, completa todos los campos obligatorios.');
            return;
        }
        if (fromAccount === toAccount) {
            setError('No puedes transferir dinero a la misma cuenta.');
            return;
        }
        if (parseFloat(amount) <= 0) {
            setError('El monto debe ser mayor que cero.');
            return;
        }

        try {
            const newTransfer = {
                from_account_id: fromAccount,
                to_account_id: toAccount,
                amount: parseFloat(amount),
                description: description.trim() || null
            };
            await axios.post(`${API_URL}/api/transfers/`, newTransfer);

            setFromAccount('');
            setToAccount('');
            setAmount('');
            setDescription('');
            setSuccess('Transferencia realizada exitosamente!');
            fetchAccounts(); // Refresh accounts to update balances

            if (onTransferCompleted) {
                onTransferCompleted();
            }

            setTimeout(() => setSuccess(''), 3000);

        } catch (err) {
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError('Ocurrió un error al realizar la transferencia.');
            }
            console.error("Error al realizar la transferencia:", err);
        }
    };

    return (
        <Card elevation={2} sx={{ mb: 3 }}>
            <CardHeader
                title="Realizar Transferencia"
                titleTypographyProps={{ variant: 'h6' }}
                avatar={<SwapHorizIcon color="primary" />}
            />
            <CardContent>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="from-account-label">Cuenta de Origen</InputLabel>
                        <Select
                            labelId="from-account-label"
                            id="from-account-select"
                            value={fromAccount}
                            label="Cuenta de Origen"
                            onChange={(e) => setFromAccount(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>Selecciona una cuenta</em>
                            </MenuItem>
                            {accounts.map((account) => (
                                <MenuItem key={account.id} value={account.id}>
                                    {account.name} (Saldo: ${account.balance.toFixed(2)})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="to-account-label">Cuenta de Destino</InputLabel>
                        <Select
                            labelId="to-account-label"
                            id="to-account-select"
                            value={toAccount}
                            label="Cuenta de Destino"
                            onChange={(e) => setToAccount(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>Selecciona una cuenta</em>
                            </MenuItem>
                            {accounts.map((account) => (
                                <MenuItem key={account.id} value={account.id}>
                                    {account.name} (Saldo: ${account.balance.toFixed(2)})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

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

                    <TextField
                        label="Descripción (Opcional)"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={2}
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
                        startIcon={<SwapHorizIcon />}
                    >
                        Realizar Transferencia
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}

export default AddTransferForm;