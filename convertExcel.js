const xlsx = require('xlsx');
const fs = require('fs');

const workbook = xlsx.readFile('ventas.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];

const allRows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

// Filas de datos (desde la fila 2 en adelante, saltando las 2 filas de encabezado)
const rows = allRows.slice(2);

// Función para limpiar y convertir a número seguro
function toNumber(value) {
  if (value === undefined || value === null) return 0;
  const limpio = value.toString().replace(/[^\d.-]/g, "");
  const numero = Number(limpio);
  return isNaN(numero) ? 0 : numero;
}

const result = rows.map(row => ({
  "Semillero": row[0],
  "Varied": row[1],
  "Variedad": row[2],
  "OFERTA": { "Primu": toNumber(row[3]) },
  "VENTA": { "Primu": toNumber(row[4]) },
  "DISPONIBLE": { "Primu": toNumber(row[5]) }
}));

// Filtrar filas vacías o totales
const cleanData = result.filter(row => row.Variedad && !String(row.Variedad).toLowerCase().includes('total'));

fs.writeFileSync('ventas.json', JSON.stringify(cleanData, null, 2), 'utf8');
console.log('Conversión completa. Archivo generado: ventas.json');
