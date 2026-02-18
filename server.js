const express = require('express');
const basicAuth = require('express-basic-auth');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// 🔒 Autenticación aplicada a todo el sitio
app.use(basicAuth({
  users: { 'admin': '1234' }, // Cambiá 'admin' y '1234' por tu usuario/contraseña
  challenge: true
}));

// Servir frontend (public) protegido
app.use(express.static(path.join(__dirname, 'public')));

// API protegida
app.get('/api/ventas', (req, res) => {
  const ventas = require('./data/ventas.json');
  res.json(ventas);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});