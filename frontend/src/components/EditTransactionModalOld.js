import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Button, TextField, Box, Modal, Typography, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

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

// Helper para formatear la fecha
const formatDateString = (isoString) => {
    if (!isoString) return '';
    return isoString.split('T')[0];
}

function EditTransactionModal({ transaction, open, onClose, onDataUpdate }) {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (transaction) {
            setAmount(transaction.amount.toString());
            setDescription(transaction.description || '');
            setDate(formatDateString(transaction.date));
        }
    }, [transaction]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const updatedData = {
                amount: parseFloat(amount),
                description: description,
                date: date
            };
            await axios.put(`${API_URL}/api/transactions/${transaction.id}`, updatedData);
            onDataUpdate();
            onClose();
        } catch (err) {
            setError('Ocurrió un error al actualizar la transacción.');
            console.error("Error al actualizar:", err);
        }
    };

    if (!transaction) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" component="h2">Editar Transacción</Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                    <TextField
                        label="Descripción"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <TextField
                        label="Monto"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                    <TextField
                        label="Fecha"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
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

export default EditTransactionModal;