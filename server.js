const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware para parsear formularios
app.use(express.urlencoded({ extended: true }));

// Configuración de sesiones
app.use(session({
  secret: 'clave-secreta', // cámbiala por algo seguro
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 5 * 60 * 1000 } // sesión expira en 5 minutos
}));

// Middleware de autenticación
function requireLogin(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Página de login
app.get('/login', (req, res) => {
  res.send(`
    <h2>Login</h2>
    <form method="post" action="/login">
      <label>Usuario: <input type="text" name="username"/></label><br/>
      <label>Contraseña: <input type="password" name="password"/></label><br/>
      <button type="submit">Ingresar</button>
    </form>
  `);
});

// Procesar login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Usuarios válidos
  const users = { admin: '1234', ventas: 'abcd', consulta: 'xyz' };

  if (users[username] && users[username] === password) {
    req.session.user = username;
    res.redirect('/');
  } else {
    res.send('Credenciales inválidas. <a href="/login">Intentar de nuevo</a>');
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Rutas protegidas
app.use(requireLogin, express.static(path.join(__dirname, 'public')));

app.get('/api/ventas', requireLogin, (req, res) => {
  const ventas = require('./data/ventas.json');
  res.json(ventas);
});

app.get('/api/avance', requireLogin, (req, res) => {
  const avance = require('./data/avance.json');
  res.json(avance);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});