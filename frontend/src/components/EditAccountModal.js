import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button, TextField, Box, Modal, Typography, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const API_URL = process.env.REACT_APP_API_URL || 'https://ingresos-gastos-backend.onrender.com';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function EditAccountModal({ account, open, onClose, onDataUpdate }) {
    const [name, setName] = useState('');
    const [balance, setBalance] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (account) {
            setName(account.name);
            setBalance(account.balance.toString());
        }
    }, [account]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const updatedData = {
                name: name,
                balance: parseFloat(balance)
            };
            await axios.put(`${API_URL}/api/accounts/${account.id}`, updatedData);
            onDataUpdate();
            onClose();
        } catch (err) {
            setError('Ocurrió un error al actualizar la cuenta.');
            console.error("Error al actualizar la cuenta:", err);
        }
    };

    if (!account) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" component="h2">Editar Cuenta</Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                    <TextField
                        label="Nombre de la Cuenta"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Balance"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="number"
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        required
                    />
                    {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Guardar Cambios
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default EditAccountModal;
