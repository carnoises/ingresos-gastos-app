import React, { useState } from 'react';
import axios from 'axios';
import { 
    Typography, Accordion, AccordionSummary, AccordionDetails, 
    List, ListItem, ListItemText, IconButton, Box, Card, CardContent, CardHeader,
    Chip, LinearProgress, Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditTransactionModal from './EditTransactionModal';
import EditAccountModal from './EditAccountModal'; // New import
import { formatCurrency } from '../utils/formatters';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function Accounts({ accounts, onDataUpdate, loading }) {
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [editingAccount, setEditingAccount] = useState(null); // New state
    const [expandedAccount, setExpandedAccount] = useState(null);

    const handleOpenEditModal = (transaction) => {
        setEditingTransaction(transaction);
    };

    const handleCloseEditModal = () => {
        setEditingTransaction(null);
    };

    const handleOpenEditAccountModal = (account) => { // New handler
        setEditingAccount(account);
    };

    const handleCloseEditAccountModal = () => { // New handler
        setEditingAccount(null);
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

    const handleAccordionChange = (accountId) => (event, isExpanded) => {
        setExpandedAccount(isExpanded ? accountId : null);
    };

    if (loading) {
        return (
            <Card>
                <CardHeader title="Mis Cuentas" titleTypographyProps={{ variant: 'h5' }} />
                <CardContent>
                    <LinearProgress />
                    <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                        Cargando cuentas...
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card elevation={2}>
            <CardHeader 
                title="Mis Cuentas" 
                titleTypographyProps={{ variant: 'h5', color: "primary" }}
                action={
                    <Chip 
                        label={`Total: ${formatCurrency(accounts.reduce((sum, acc) => sum + acc.balance, 0))}`} 
                        color="primary"
                        variant="outlined"
                    />
                }
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
                {accounts.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body1" color="textSecondary">
                            No hay cuentas todavía. ¡Crea tu primera cuenta!
                        </Typography>
                    </Box>
                ) : (
                    accounts.map((account) => (
                        <Accordion 
                            key={account.id} 
                            expanded={expandedAccount === account.id}
                            onChange={handleAccordionChange(account.id)}
                            sx={{ 
                                mb: 1, 
                                boxShadow: 'none', 
                                border: '1px solid', 
                                borderColor: 'divider',
                                '&:before': { display: 'none' }
                            }}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                                    <Box sx={{ 
                                        width: 8, 
                                        height: 8, 
                                        borderRadius: '50%', 
                                        backgroundColor: account.balance >= 0 ? 'success.main' : 'error.main',
                                        mr: 1.5 
                                    }} />
                                    <Typography sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                                        {account.name}
                                    </Typography>
                                    <IconButton
                                        edge="end"
                                        aria-label="edit account"
                                        onClick={(e) => { e.stopPropagation(); handleOpenEditAccountModal(account); }}
                                        size="small"
                                        sx={{ ml: 1 }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                                <Chip 
                                    label={formatCurrency(account.balance)} 
                                    size="small"
                                    color={account.balance >= 0 ? "success" : "error"}
                                    variant={account.balance >= 0 ? "outlined" : "filled"}
                                    sx={{ fontWeight: 'bold', minWidth: 80 }}
                                />
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 0, bgcolor: 'grey.50' }}>
                                <List dense sx={{ width: '100%' }}>
                                    {account.transactions.length === 0 ? (
                                        <ListItem>
                                            <ListItemText 
                                                primary="No hay transacciones en esta cuenta." 
                                                sx={{ pl: 2, textAlign: 'center', color: 'text.secondary' }} 
                                            />
                                        </ListItem>
                                    ) : (
                                        account.transactions.map(t => (
                                            <ListItem 
                                                key={t.id} 
                                                divider
                                                secondaryAction={
                                                    <Box>
                                                        <IconButton 
                                                            edge="end" 
                                                            aria-label="edit" 
                                                            onClick={() => handleOpenEditModal(t)} 
                                                            size="small"
                                                            color="primary"
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton 
                                                            edge="end" 
                                                            aria-label="delete" 
                                                            onClick={() => handleDelete(t.id)} 
                                                            size="small"
                                                            color="error"
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                }
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                                                    {t.type === 'expense' ? (
                                                        <RemoveIcon color="error" fontSize="small" />
                                                    ) : (
                                                        <AddIcon color="success" fontSize="small" />
                                                    )}
                                                </Box>
                                                <ListItemText 
                                                    primary={t.description || 'Sin descripción'}
                                                    secondary={`Fecha: ${new Date(t.date).toLocaleDateString()}`}
                                                    sx={{ 
                                                        color: t.type === 'expense' ? 'error.main' : 'success.main',
                                                        '& .MuiListItemText-primary': { fontWeight: 500 }
                                                    }}
                                                />
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        fontWeight: 'bold', 
                                                        color: t.type === 'expense' ? 'error.main' : 'success.main',
                                                        minWidth: 80,
                                                        textAlign: 'right'
                                                    }}
                                                >
                                                    {t.type === 'expense' ? '-' : '+'}{formatCurrency(t.amount)}
                                                </Typography>
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
                <EditAccountModal // New modal
                    account={editingAccount}
                    open={!!editingAccount}
                    onClose={handleCloseEditAccountModal}
                    onDataUpdate={onDataUpdate}
                />
            </CardContent>
        </Card>
    );
}

export default Accounts;