import React, { useState } from 'react';
import axios from 'axios';
import { 
    Card, Typography, Box, Select, MenuItem, InputLabel, 
    FormControl, Button, Grid, RadioGroup, FormControlLabel, Radio, FormLabel, CardContent, CardHeader
} from '@mui/material';
import { formatCurrency } from '../utils/formatters'; // Importar la función de formato

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function Reports() {
    const [reportData, setReportData] = useState(null);
    const [reportType, setReportType] = useState('monthly'); // monthly | daily
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [day, setDay] = useState(new Date().getDate());
    const [loading, setLoading] = useState(false);

    const fetchReport = async () => {
        setLoading(true);
        setReportData(null);
        let url = '';
        let params = {};

        if (reportType === 'monthly') {
            url = `${API_URL}/api/reports/monthly`;
            params = { year, month };
        } else { // daily
            url = `${API_URL}/api/reports/daily`;
            params = { year, month, day };
        }

        try {
            const response = await axios.get(url, { params });
            setReportData(response.data);
        } catch (error) {
            console.error("Error al obtener el reporte:", error);
            setReportData(null);
        }
        setLoading(false);
    };

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from({ length: 31 }, (_, i) => i + 1); // Simplificación, no valida por mes

    return (
        <Card>
            <CardHeader title="Generar Reporte" titleTypographyProps={{ variant: 'h5' }} />
            <CardContent>
                <FormControl component="fieldset" sx={{ mb: 2 }}>
                    <FormLabel component="legend">Tipo de Reporte</FormLabel>
                    <RadioGroup row value={reportType} onChange={(e) => setReportType(e.target.value)}>
                        <FormControlLabel value="monthly" control={<Radio />} label="Mensual" />
                        <FormControlLabel value="daily" control={<Radio />} label="Diario" />
                    </RadioGroup>
                </FormControl>

                <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={reportType === 'daily' ? 3 : 5}>
                        <FormControl fullWidth>
                            <InputLabel>Año</InputLabel>
                            <Select value={year} label="Año" onChange={(e) => setYear(e.target.value)}>
                                {years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={reportType === 'daily' ? 3 : 5}>
                        <FormControl fullWidth>
                            <InputLabel>Mes</InputLabel>
                            <Select value={month} label="Mes" onChange={(e) => setMonth(e.target.value)}>
                                {months.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    {reportType === 'daily' && (
                        <Grid item xs={12} sm={3}>
                            <FormControl fullWidth>
                                <InputLabel>Día</InputLabel>
                                <Select value={day} label="Día" onChange={(e) => setDay(e.target.value)}>
                                    {days.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                    <Grid item xs={12} sm={3}>
                        <Button variant="contained" onClick={fetchReport} disabled={loading} fullWidth sx={{height: '100%'}}>
                            Generar
                        </Button>
                    </Grid>
                </Grid>

                {reportData && (
                    <Box sx={{ p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
                        <Typography variant="h6">
                            Resultados para: {reportData.day ? `${reportData.day}/` : ''}{reportData.month}/{reportData.year}
                        </Typography>
                        <Typography variant="body1" color="green">Ingresos Totales: ${formatCurrency(reportData.total_income)}</Typography>
                        <Typography variant="body1" color="red">Gastos Totales: ${formatCurrency(reportData.total_expense)}</Typography>
                        <Typography variant="h6" sx={{ mt: 1 }}>Balance Neto: ${formatCurrency(reportData.net_balance)}</Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}

export default Reports;
