const express = require('express');
const fs = require('fs');
const { parse } = require('csv-parse');
const basicAuth = require('express-basic-auth');

const app = express();
const ventas = [];

app.use(basicAuth({
  users: { 'dshnos': 'febrero' },
  challenge: true
}));

app.use(express.static('public'));

fs.createReadStream('data/ventas.csv')
  .pipe(parse({ delimiter: ';', from_line: 3, relax_column_count: true }))
  .on('data', (cols) => {
    const row = {
      Variedad: cols[0] || '',
      Variedad_Calidad: cols[1] || '',
      TOTAL_OFERTA: cols[4] || '',
      TOTAL_VENTAS: cols[7] || '',
      TOTAL_DISPONIBLE: cols[10] || '',
      Comentarios: cols[11] || ''
    };
    ventas.push(row);
  })
  .on('end', () => {
    console.log('Datos de ventas cargados correctamente');
  });

app.get('/api/ventas', (req, res) => {
  res.json(ventas);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});