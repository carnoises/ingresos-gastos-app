import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
    AppBar, Toolbar, Typography, Container, CssBaseline, 
    Grid, Tabs, Tab, Box, Paper, Chip, useMediaQuery, useTheme
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

import Accounts from './components/Accounts';
import AddAccountForm from './components/AddAccountForm';
import AddTransactionForm from './components/AddTransactionForm';
import AddTransferForm from './components/AddTransferForm';
import Reports from './components/Reports';
import { formatCurrency } from './utils/formatters';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Panel de Pestaña
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box sx={{ pt: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [accounts, setAccounts] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/accounts/`);
      setAccounts(response.data);
    } catch (error) {
      console.error("Error al obtener las cuentas:", error);
    } finally {
      setLoading(false);
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
      <AppBar position="sticky" color="primary" elevation={2}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }} color="white">
            FinanzApp
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Chip 
              icon={<AccountBalanceIcon />} 
              label={`Banco: ${formatCurrency(bankBalance)}`} 
              size="small"
              sx={{ color: 'white', backgroundColor: bankBalance < 0 ? '#f44336' : 'rgba(255,255,255,0.2)' }}
            />
            <Chip 
              icon={<AttachMoneyIcon />} 
              label={`Efectivo: ${formatCurrency(cashBalance)}`} 
              size="small"
              sx={{ color: 'white', backgroundColor: cashBalance < 0 ? '#f44336' : 'rgba(255,255,255,0.2)' }}
            />
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f7f9fc' }}>
            <Tabs 
              value={currentTab} 
              onChange={handleTabChange} 
              centered={!isMobile}
              variant={isMobile ? "fullWidth" : "standard"}
              aria-label="Secciones de la aplicación"
            >
              <Tab icon={<AccountBalanceWalletIcon />} label="Operaciones" />
              <Tab icon={<SwapHorizIcon />} label="Transferencias" />
              <Tab icon={<AssessmentIcon />} label="Reportes" />
            </Tabs>
          </Box>

                    <TabPanel value={currentTab} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <AddTransactionForm accounts={accounts} onTransactionAdded={handleDataUpdate} />
                <AddAccountForm onAccountAdded={handleDataUpdate} />
              </Grid>
              <Grid item xs={12} md={8}>
                <Accounts accounts={accounts} onDataUpdate={handleDataUpdate} loading={loading} />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <AddTransferForm onTransferCompleted={handleDataUpdate} />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <Reports />
          </TabPanel>




        </Paper>
      </Container>
    </>
  );
}

export default App;