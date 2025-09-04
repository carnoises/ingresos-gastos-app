import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Button, TextField, Box, Modal, Typography, IconButton,
    Alert, InputAdornment, Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const API_URL = process.env.REACT_APP_API_URL || 'https://ingresos-gastos-backend.onrender.com';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
  maxWidth: '100%',
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
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
    const [loading, setLoading] = useState(false);

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
        setLoading(true);

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
        } finally {
            setLoading(false);
        }
    };

    if (!transaction) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <EditIcon sx={{ mr: 1 }} />
                        Editar Transacción
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
                
                <Box component="form" onSubmit={handleSubmit} noValidate>
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
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>
                    </Grid>
                    
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button onClick={onClose} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            disabled={loading}
                            startIcon={<EditIcon />}
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}

export default EditTransactionModal;