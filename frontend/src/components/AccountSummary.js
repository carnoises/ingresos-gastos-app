import React from 'react';
import { Typography, List, ListItem, ListItemText, Card, CardContent, CardHeader } from '@mui/material';

function AccountSummary({ accounts }) {
  // Calculate total balance
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader title="Resumen de Cuentas" titleTypographyProps={{ variant: 'h5' }} />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Balance Total: ${totalBalance.toFixed(2)}
        </Typography>
        <List dense>
          {accounts.length === 0 ? (
            <ListItem>
              <ListItemText primary="No hay cuentas para mostrar." />
            </ListItem>
          ) : (
            accounts.map((account) => (
              <ListItem key={account.id}>
                <ListItemText
                  primary={account.name}
                  secondary={`Balance: $${account.balance.toFixed(2)}`}
                />
              </ListItem>
            ))
          )}
        </List>
      </CardContent>
    </Card>
  );
}

export default AccountSummary;
