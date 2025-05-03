const express = require('express');
const cors = require('cors');
const path = require('path');
const routesPath = path.resolve('./routes');
console.log('[📦 Cargando rutas desde]', routesPath);

const routes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas API
const routes = require('./routes');
console.log('[DEBUG] Archivo de rutas cargado desde:', require.resolve('./routes'));

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});