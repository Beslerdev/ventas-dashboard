const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

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

// Servir archivos estáticos (logo.png, CSS, etc.)
app.use(express.static(path.join(__dirname)));

// Ruta raíz -> index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint que tu frontend espera
app.get('/api/ventas', (req, res) => {
  res.sendFile(path.join(__dirname, 'ventas.json'));
});

// Arrancar servidor en Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
 