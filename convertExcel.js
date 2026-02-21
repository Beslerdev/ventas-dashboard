const xlsx = require('xlsx');
const fs = require('fs');

const workbook = xlsx.readFile('ventas.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];

// Leer todas las filas como arrays
const allRows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

// Fila 1 son los encabezados
const headers = allRows[1];

// Fila 2 en adelante son los datos reales
const rows = allRows.slice(2);

// Mapear filas con los encabezados
const result = rows.map(row => {
  const obj = {};
  headers.forEach((h, i) => {
    obj[h] = row[i];
  });
  return obj;
});

// Filtrar filas vacías o Totales
const cleanData = result.filter(row => row.Variedad && !String(row.Variedad).toLowerCase().includes('total'));

fs.writeFileSync('ventas.json', JSON.stringify(cleanData, null, 2), 'utf8');
console.log('Conversión completa. Archivo generado: ventas.json');