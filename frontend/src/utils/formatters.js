export const formatCurrency = (value) => {
  if (typeof value !== 'number') {
    return value; // Devolver tal cual si no es un número
  }
  // Usamos 'en-US' para el formato deseado (coma para miles, punto para decimales)
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};