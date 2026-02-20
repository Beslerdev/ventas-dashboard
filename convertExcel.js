const xlsx = require('xlsx');
const fs = require('fs');

// Leer el archivo Excel
const workbook = xlsx.readFile('ventas.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];

// Convertir a JSON, ignorando la primera fila (bloques de títulos)
// range:1 → empieza a leer desde la fila 2 (encabezados reales)
const rawData = xlsx.utils.sheet_to_json(sheet, { range: 1 });

// Filtrar filas vacías o la fila de Totales
const data = rawData.filter(row => {
  const variedad = row['Variedad'];
  return variedad && !String(variedad).toLowerCase().includes('total');
});

// Guardar como JSON
fs.writeFileSync('ventas.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Conversión completa. Archivo generado: ventas.json');