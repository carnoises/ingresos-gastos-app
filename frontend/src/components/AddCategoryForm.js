import React, { useState } from 'react';
import axios from 'axios';
import {
    Button, TextField, Card, Box, CardContent, CardHeader,
    Alert, InputAdornment
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function AddCategoryForm({ onCategoryAdded }) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!name.trim()) {
            setError('El nombre de la categoría es obligatorio.');
            return;
        }

        try {
            const newCategory = {
                name: name
            };
            await axios.post(`${API_URL}/api/categories/`, newCategory);

            // Limpiar el formulario
            setName('');

            // Mostrar mensaje de éxito
            setSuccess('Categoría creada exitosamente!');

            // Notificar al componente padre que se añadió una categoría
            if (onCategoryAdded) {
                onCategoryAdded();
            }

            // Ocultar mensaje de éxito después de 3 segundos
            setTimeout(() => setSuccess(''), 3000);

        } catch (err) {
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError('Ocurrió un error al crear la categoría.');
            }
            console.error("Error al crear la categoría:", err);
        }
    };

    return (
        <Card elevation={2} sx={{ mb: 3 }}>
            <CardHeader
                title="Añadir Nueva Categoría"
                titleTypographyProps={{ variant: 'h6' }}
                avatar={<CategoryIcon color="primary" />}
            />
            <CardContent>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="Nombre de la Categoría"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoComplete="off"
                    />
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            {success}
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        startIcon={<CategoryIcon />}
                    >
                        Crear Categoría
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}

export default AddCategoryForm;