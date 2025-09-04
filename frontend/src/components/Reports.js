import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Card, Typography, Box, Select, MenuItem, InputLabel, 
    FormControl, Button, Grid, RadioGroup, FormControlLabel, 
    Radio, FormLabel, CardContent, CardHeader, Alert,
    CircularProgress, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import DownloadIcon from '@mui/icons-material/Download';
import { formatCurrency } from '../utils/formatters';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Función para obtener los nombres de los meses en español
const getMonthName = (monthNumber) => {
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[monthNumber - 1] || '';
};

// Función para obtener los días en un mes (reemplaza getDaysInMonth de date-fns)
const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
};

function Reports() {
    const [reportData, setReportData] = useState(null);
    const [reportType, setReportType] = useState('monthly');
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [day, setDay] = useState(new Date().getDate());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [daysInMonth, setDaysInMonth] = useState(31);

    // Actualizar días disponibles cuando cambia el mes o año
    useEffect(() => {
        const daysInCurrentMonth = getDaysInMonth(year, month);
        setDaysInMonth(daysInCurrentMonth);
        
        // Ajustar el día si es mayor que los días del mes
        if (day > daysInCurrentMonth) {
            setDay(daysInCurrentMonth);
        }
    }, [month, year, day]);

    const fetchReport = async () => {
        setLoading(true);
        setReportData(null);
        setError(null);
        
        let url = '';
        let params = {};

        if (reportType === 'monthly') {
            url = `${API_URL}/api/reports/monthly`;
            params = { year, month };
        } else {
            url = `${API_URL}/api/reports/daily`;
            params = { year, month, day };
        }

        try {
            const response = await axios.get(url, { params });
            setReportData(response.data);
        } catch (error) {
            console.error("Error al obtener el reporte:", error);
            setError("Error al cargar el reporte. Por favor, intente nuevamente.");
            setReportData(null);
        }
        setLoading(false);
    };

    const handleExport = () => {
        // Función para exportar reporte (podría implementarse con la API)
        alert('Funcionalidad de exportación en desarrollo');
    };

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
    const months = Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: getMonthName(i + 1)
    }));
    
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const getNetBalanceIcon = (balance) => {
        if (balance > 0) return <TrendingUpIcon />;
        if (balance < 0) return <TrendingDownIcon />;
        return null;
    };

    return (
        <Card sx={{ maxWidth: 1000, margin: '0 auto' }}>
            <CardHeader 
                title="Generar Reporte Financiero" 
                titleTypographyProps={{ variant: 'h4', fontWeight: 'bold' }}
                sx={{ backgroundColor: 'primary.main', color: 'white' }}
            />
            <CardContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <FormControl component="fieldset" sx={{ mb: 3 }}>
                    <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Tipo de Reporte
                    </FormLabel>
                    <RadioGroup row value={reportType} onChange={(e) => setReportType(e.target.value)}>
                        <FormControlLabel 
                            value="monthly" 
                            control={<Radio />} 
                            label="Mensual" 
                        />
                        <FormControlLabel 
                            value="daily" 
                            control={<Radio />} 
                            label="Diario" 
                        />
                    </RadioGroup>
                </FormControl>

                <Grid container spacing={2} alignItems="flex-end" sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={reportType === 'daily' ? 2 : 3}>
                        <FormControl fullWidth>
                            <InputLabel>Año</InputLabel>
                            <Select 
                                value={year} 
                                label="Año" 
                                onChange={(e) => setYear(e.target.value)}
                            >
                                {years.map(y => (
                                    <MenuItem key={y} value={y}>{y}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={reportType === 'daily' ? 3 : 4}>
                        <FormControl fullWidth>
                            <InputLabel>Mes</InputLabel>
                            <Select 
                                value={month} 
                                label="Mes" 
                                onChange={(e) => setMonth(e.target.value)}
                            >
                                {months.map(m => (
                                    <MenuItem key={m.value} value={m.value}>
                                        {m.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    {reportType === 'daily' && (
                        <Grid item xs={12} sm={3}>
                            <FormControl fullWidth>
                                <InputLabel>Día</InputLabel>
                                <Select 
                                    value={day} 
                                    label="Día" 
                                    onChange={(e) => setDay(e.target.value)}
                                >
                                    {days.map(d => (
                                        <MenuItem key={d} value={d}>{d}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                    <Grid item xs={12} sm={reportType === 'daily' ? 2 : 3}>
                        <Button 
                            variant="contained" 
                            onClick={fetchReport} 
                            disabled={loading}
                            fullWidth 
                            sx={{ height: '56px' }}
                            startIcon={loading ? <CircularProgress size={20} /> : null}
                        >
                            {loading ? 'Generando...' : 'Generar'}
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button 
                            variant="outlined" 
                            onClick={handleExport}
                            disabled={!reportData}
                            fullWidth 
                            sx={{ height: '56px' }}
                            startIcon={<DownloadIcon />}
                        >
                            Exportar
                        </Button>
                    </Grid>
                </Grid>

                {reportData && (
                    <Paper elevation={2} sx={{ p: 3, backgroundColor: '#fafafa' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h5" fontWeight="bold">
                                Reporte {reportType === 'daily' ? 'Diario' : 'Mensual'}
                            </Typography>
                            <Chip 
                                label={reportData.day ? 
                                    `${reportData.day}/${reportData.month}/${reportData.year}` : 
                                    `${getMonthName(reportData.month)} ${reportData.year}`
                                } 
                                color="primary" 
                                variant="outlined"
                            />
                        </Box>

                        <Grid container spacing={3} sx={{ mb: 3 }}>
                            <Grid item xs={12} md={4}>
                                <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e9' }}>
                                    <Typography variant="h6" color="green" gutterBottom>
                                        Ingresos Totales
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold">
                                        {formatCurrency(reportData.total_income)}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: '#ffebee' }}>
                                    <Typography variant="h6" color="error" gutterBottom>
                                        Gastos Totales
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold">
                                        {formatCurrency(reportData.total_expense)}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper elevation={1} sx={{ 
                                    p: 2, 
                                    textAlign: 'center', 
                                    bgcolor: reportData.net_balance >= 0 ? '#e8f5e9' : '#ffebee'
                                }}>
                                    <Typography 
                                        variant="h6" 
                                        color={reportData.net_balance >= 0 ? 'green' : 'error'} 
                                        gutterBottom
                                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        Balance Neto
                                        {getNetBalanceIcon(reportData.net_balance)}
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold">
                                        {formatCurrency(reportData.net_balance)}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* Sección para detalles de transacciones (si están disponibles en la API) */}
                        {reportData.transactions && reportData.transactions.length > 0 && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Detalle de Transacciones
                                </Typography>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Fecha</TableCell>
                                                <TableCell>Descripción</TableCell>
                                                <TableCell>Categoría</TableCell>
                                                <TableCell align="right">Monto</TableCell>
                                                <TableCell>Tipo</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {reportData.transactions.map((transaction) => (
                                                <TableRow key={transaction.id}>
                                                    <TableCell>{transaction.date}</TableCell>
                                                    <TableCell>{transaction.description}</TableCell>
                                                    <TableCell>{transaction.category}</TableCell>
                                                    <TableCell align="right">
                                                        {formatCurrency(transaction.amount)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            label={transaction.type === 'income' ? 'Ingreso' : 'Gasto'} 
                                                            color={transaction.type === 'income' ? 'success' : 'error'} 
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}
                    </Paper>
                )}
            </CardContent>
        </Card>
    );
}

export default Reports;