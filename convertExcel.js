const xlsx = require('xlsx');
const fs = require('fs');

const workbook = xlsx.readFile('ventas.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];

const allRows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

// Fila 0 = títulos generales
const titles = allRows[0];
// Fila 1 = subtítulos
const subtitles = allRows[1];

// Filas de datos (desde la fila 2 en adelante)
const rows = allRows.slice(2);

const result = rows.map(row => {
  const obj = {};
  // Variedad siempre en la primera columna
  obj["Variedad"] = row[0];

  // Bloque OFERTA (columnas 1-3)
  obj["OFERTA"] = {
    "Primu": row[1],
    "Original": row[2],
    "Primu + Original": row[3]
  };

  // Bloque VENTA (columnas 4-6)
  obj["VENTA"] = {
    "Primu": row[4],
    "Original": row[5],
    "Primu + Original": row[6]
  };

  // Bloque DISPONIBLE (columnas 7-9)
  obj["DISPONIBLE"] = {
    "Primu": row[7],
    "Original": row[8],
    "Primu + Original": row[9]
  };

  return obj;
});

// Filtrar filas vacías o totales
const cleanData = result.filter(row => row.Variedad && !String(row.Variedad).toLowerCase().includes('total'));

fs.writeFileSync('ventas.json', JSON.stringify(cleanData, null, 2), 'utf8');
console.log('Conversión completa. Archivo generado: ventas.json');