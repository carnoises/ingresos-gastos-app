import React, { useState } from 'react';
import axios from 'axios';
import { 
    Typography, Accordion, AccordionSummary, AccordionDetails, 
    List, ListItem, ListItemText, IconButton, Box, Card, CardContent, CardHeader
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditTransactionModal from './EditTransactionModal';
import { formatCurrency } from '../utils/formatters'; // Importar la función de formato

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function Accounts({ accounts, onDataUpdate }) {
    const [editingTransaction, setEditingTransaction] = useState(null);

    const handleOpenEditModal = (transaction) => {
        setEditingTransaction(transaction);
    };

    const handleCloseEditModal = () => {
        setEditingTransaction(null);
    };

    const handleDelete = async (transactionId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
            try {
                await axios.delete(`${API_URL}/api/transactions/${transactionId}`);
                onDataUpdate();
            } catch (error) {
                console.error("Error al eliminar la transacción:", error);
                alert("No se pudo eliminar la transacción.");
            }
        }
    };

    return (
        <Card>
            <CardHeader title="Mis Cuentas" titleTypographyProps={{ variant: 'h5' }} />
            <CardContent>
                {accounts.length === 0 ? (
                    <Typography>No hay cuentas todavía.</Typography>
                ) : (
                    accounts.map((account) => (
                        <Accordion key={account.id} sx={{ mb: 1, boxShadow: 'none', border: '1px solid #f0f0f0' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{ flexGrow: 1, fontWeight: 'bold' }}>{account.name}</Typography>
                                <Typography sx={{ fontWeight: 'bold', color: account.balance < 0 ? 'error.main' : 'primary.main' }}>
                                    Balance: ${formatCurrency(account.balance)}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 0 }}>
                                <List dense sx={{ width: '100%' }}>
                                    {account.transactions.length === 0 ? (
                                        <ListItem><ListItemText primary="No hay transacciones en esta cuenta." sx={{ pl: 2 }} /></ListItem>
                                    ) : (
                                        account.transactions.map(t => (
                                            <ListItem 
                                                key={t.id} 
                                                divider
                                                secondaryAction={
                                                    <>
                                                        <IconButton edge="end" aria-label="edit" onClick={() => handleOpenEditModal(t)} size="small">
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(t.id)} size="small">
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </>
                                                }
                                            >
                                                <ListItemText 
                                                    primary={t.description || 'Sin descripción'}
                                                    secondary={`Monto: $${formatCurrency(t.amount)} - Fecha: ${new Date(t.date).toLocaleDateString()}`}
                                                    sx={{ color: t.type === 'expense' ? 'error.main' : 'success.main' }}
                                                />
                                            </ListItem>
                                        ))
                                    )}
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    ))
                )}
                <EditTransactionModal 
                    transaction={editingTransaction}
                    open={!!editingTransaction}
                    onClose={handleCloseEditModal}
                    onDataUpdate={onDataUpdate}
                />
            </CardContent>
        </Card>
    );
}

export default Accounts;