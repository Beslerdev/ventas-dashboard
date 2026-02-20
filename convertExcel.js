const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

// Ruta al archivo Excel
const inputFile = path.join(__dirname, 'ventas.xlsx');
const outputFile = path.join(__dirname, 'ventas.json');

// Leer Excel
const workbook = xlsx.readFile(inputFile);
const sheetName = workbook.SheetNames[0]; // primera hoja
const sheet = workbook.Sheets[sheetName];

// Convertir a JSON plano
const records = xlsx.utils.sheet_to_json(sheet, { defval: "" });

// Transformar cada fila al formato anidado
const result = records.map(row => {
  return {
    Variedad: row['Variedad'],
    Variedad_Calidad: row['Variedad_Calidad'],
    OFERTA: {
      Sin_Curar: parseNumber(row['Sin Curar']),
      Curado: parseNumber(row['Curado']),
      Total: parseNumber(row['TOTAL OFERTA'])
    },
    VENTAS: {
      Sin_Curar: parseNumber(row['Sin Curar_ventas'] || row['Sin Curar (Ventas)']),
      Curado: parseNumber(row['Curado_ventas'] || row['Curado (Ventas)']),
      Total: parseNumber(row['TOTAL VENTAS'])
    },
    DISPONIBLE: {
      Sin_Curar: parseNumber(row['Sin Curar_disponible'] || row['Sin Curar (Disponible)']),
      Curado: parseNumber(row['Curado_disponible'] || row['Curado (Disponible)']),
      Total: row['TOTAL DISPONIBLE'] === 'AGOTADA'
        ? 'AGOTADA'
        : parseNumber(row['TOTAL DISPONIBLE'])
    },
    Comentarios: row['TOTAL DISPONIBLE'] === 'AGOTADA' ? 'AGOTADA' : ''
  };
});

// Guardar JSON
fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), 'utf8');

function parseNumber(value) {
  if (!value) return 0;
  const clean = String(value).replace(/[()]/g, '').trim();
  if (isNaN(clean)) return clean;
  return Number(clean);
}

console.log('Conversión completa. Archivo generado:', outputFile);