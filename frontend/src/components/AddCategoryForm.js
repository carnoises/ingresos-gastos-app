import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button, TextField, Card, Box, CardContent, CardHeader,
    Alert, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function AddCategoryForm({ onCategoryAdded }) {
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editName, setEditName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/categories/`);
            setCategories(response.data);
        } catch (err) {
            console.error("Error al cargar categorías:", err);
            setError('Error al cargar las categorías disponibles.');
        }
    };

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

            setName('');
            setSuccess('Categoría creada exitosamente!');
            fetchCategories(); // Refresh list
            if (onCategoryAdded) {
                onCategoryAdded();
            }
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

    const handleEditClick = (category) => {
        setEditingCategory(category);
        setEditName(category.name);
    };

    const handleEditClose = () => {
        setEditingCategory(null);
        setEditName('');
    };

    const handleEditSave = async () => {
        setError('');
        setSuccess('');
        if (!editName.trim()) {
            setError('El nombre de la categoría no puede estar vacío.');
            return;
        }
        try {
            await axios.put(`${API_URL}/api/categories/${editingCategory.id}`, { name: editName });
            setSuccess('Categoría actualizada exitosamente!');
            handleEditClose();
            fetchCategories(); // Refresh list
            if (onCategoryAdded) {
                onCategoryAdded();
            }
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError('Ocurrió un error al actualizar la categoría.');
            }
            console.error("Error al actualizar la categoría:", err);
        }
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
            try {
                await axios.delete(`${API_URL}/api/categories/${categoryId}`);
                setSuccess('Categoría eliminada exitosamente!');
                fetchCategories(); // Refresh list
                if (onCategoryAdded) {
                    onCategoryAdded();
                }
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                if (err.response && err.response.data && err.response.data.detail) {
                    setError(err.response.data.detail);
                } else {
                    setError('Ocurrió un error al eliminar la categoría.');
                }
                console.error("Error al eliminar la categoría:", err);
            }
        }
    };

    return (
        <>
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

            <Card elevation={2} sx={{ mb: 3 }}>
                <CardHeader
                    title="Categorías Existentes"
                    titleTypographyProps={{ variant: 'h6' }}
                    avatar={<CategoryIcon color="action" />}
                />
                <CardContent sx={{ p: 0 }}>
                    {categories.length === 0 ? (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <Alert severity="info">No hay categorías creadas aún.</Alert>
                        </Box>
                    ) : (
                        <List dense>
                            {categories.map((category) => (
                                <ListItem
                                    key={category.id}
                                    secondaryAction={
                                        <>
                                            <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(category)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(category.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
                                    }
                                >
                                    <ListItemText primary={category.name} />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </CardContent>
            </Card>

            {/* Edit Category Modal */}
            <Dialog open={!!editingCategory} onClose={handleEditClose}>
                <DialogTitle>Editar Categoría</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nombre de la Categoría"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose}>Cancelar</Button>
                    <Button onClick={handleEditSave}>Guardar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AddCategoryForm;