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

// Configuración de sesión (básica)
app.use(session({
  secret: 'clave-secreta', // cámbiala por algo seguro
  resave: false,
  saveUninitialized: true
}));

// Servir archivos estáticos (incluye ventas.json y frontend)
app.use(express.static(path.join(__dirname)));

// Endpoint explícito para ventas.json
app.get('/ventas', (req, res) => {
  res.sendFile(path.join(__dirname, 'ventas.json'));
});

// Ruta principal (si tenés un index.html para el dashboard)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Arrancar servidor en Render (usa PORT si está definido)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
 