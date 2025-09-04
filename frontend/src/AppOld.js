import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
    AppBar, Toolbar, Typography, Container, CssBaseline, 
    Grid, Tabs, Tab, Box, Paper 
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssessmentIcon from '@mui/icons-material/Assessment';

import Accounts from './components/Accounts';
import AddAccountForm from './components/AddAccountForm';
import AddTransactionForm from './components/AddTransactionForm';
import Reports from './components/Reports';
import { formatCurrency } from './utils/formatters'; // Importar la función de formato

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Panel de Pestaña
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [accounts, setAccounts] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const fetchAccounts = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/accounts/`);
      setAccounts(response.data);
    } catch (error) {
      console.error("Error al obtener las cuentas:", error);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleDataUpdate = () => {
    fetchAccounts();
  };

  // Calcular balances de Banco y Efectivo
  const bankBalance = accounts.reduce((sum, account) => {
    if (account.name.toLowerCase() !== 'efectivo') {
      return sum + account.balance;
    }
    return sum;
  }, 0);

  const cashBalance = accounts.reduce((sum, account) => {
    if (account.name.toLowerCase() === 'efectivo') {
      return sum + account.balance;
    }
    return sum;
  }, 0);

  return (
    <>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} color="white">
            Gestor de Ingresos y Gastos
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="subtitle1" color="white">
              Banco: ${formatCurrency(bankBalance)}
            </Typography>
            <Typography variant="subtitle1" color="white">
              Efectivo: ${formatCurrency(cashBalance)}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentTab} onChange={handleTabChange} centered>
              <Tab icon={<AccountBalanceWalletIcon />} label="Operaciones" />
              <Tab icon={<AssessmentIcon />} label="Reportes" />
            </Tabs>
          </Box>

          <TabPanel value={currentTab} index={0}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}> {/* Reducir ancho para formularios */}
                <AddTransactionForm accounts={accounts} onTransactionAdded={handleDataUpdate} />
                <AddAccountForm onAccountAdded={handleDataUpdate} />
              </Grid>
              <Grid item xs={12} md={8}> {/* Aumentar ancho para cuentas */}
                <Accounts accounts={accounts} onDataUpdate={handleDataUpdate} />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <Reports />
          </TabPanel>
        </Paper>
      </Container>
    </>
  );
}

export default App;
