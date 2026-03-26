const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de sesión
app.use(session({
  secret: 'clave-secreta',
  resave: false,
  saveUninitialized: true
}));

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// Ruta raíz -> index.html dentro de /public
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint que tu frontend espera
app.get('/api/ventas', (req, res) => {
  fs.readFile(path.join(__dirname, 'ventas.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error leyendo ventas.json:', err);
      return res.status(500).json({ error: 'Error leyendo ventas.json' });
    }
    try {
      const ventas = JSON.parse(data);
      res.json(ventas);
    } catch (parseErr) {
      console.error('Error parseando ventas.json:', parseErr);
      res.status(500).json({ error: 'Error parseando ventas.json' });
    }
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});