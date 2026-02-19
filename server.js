const express = require('express');
const basicAuth = require('express-basic-auth');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// 🔒 Autenticación aplicada a todas las rutas
app.use(basicAuth({
  users: { 'admin': '1234' }, // Cambiá usuario/contraseña
  challenge: true,
  unauthorizedResponse: (req) => 'Acceso restringido: credenciales requeridas'
}));

// Servir frontend protegido
app.use(express.static(path.join(__dirname, 'public')));

// API protegida
app.get('/api/ventas', (req, res) => {
  const ventas = require('./data/ventas.json');
  res.json(ventas);
});

app.get('/api/avance', (req, res) => {
  const avance = require('./data/avance.json');
  res.json(avance);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});