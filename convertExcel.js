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

// Función para limpiar y convertir a número seguro
function toNumber(value) {
  if (value === undefined || value === null) return 0;
  const limpio = value.toString().replace(/[^\d.-]/g, "");
  const numero = Number(limpio);
  return isNaN(numero) ? 0 : numero;
}

const result = rows.map(row => {
  const obj = {};
  // Variedad siempre en la primera columna
  obj["Variedad"] = row[0];

  // Bloque OFERTA (columnas 1-3)
  obj["OFERTA"] = {
    "Primu": toNumber(row[1]),
    "Original": toNumber(row[2]),
    "Primu + Original": toNumber(row[3])
  };

  // Bloque VENTA (columnas 4-6)
  obj["VENTA"] = {
    "Primu": toNumber(row[4]),
    "Original": toNumber(row[5]),
    "Primu + Original": toNumber(row[6])
  };

  // Bloque DISPONIBLE (columnas 7-9)
  obj["DISPONIBLE"] = {
    "Primu": toNumber(row[7]),
    "Original": toNumber(row[8]),
    "Primu + Original": toNumber(row[9])
  };

  return obj;
});

// Filtrar filas vacías o totales
const cleanData = result.filter(row => row.Variedad && !String(row.Variedad).toLowerCase().includes('total'));

fs.writeFileSync('ventas.json', JSON.stringify(cleanData, null, 2), 'utf8');
console.log('Conversión completa. Archivo generado: ventas.json');
