require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const admin = require('./firebase'); // Agregar Firebase
const routesPath = path.join(__dirname, 'routes');
console.log('[📦 Cargando rutas desde]', routesPath);

const routes = require('./routes'); // Solo una vez

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Monta las rutas bajo /api
app.use('/api', routes);

// Sirve archivos estáticos del build de Astro
app.use(express.static(path.join(__dirname, '../dist')));

// Para cualquier otra ruta que no sea API, devuelve index.html
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Sirve index.html para POST en rutas de frontend (como /confirmacion)
app.post(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});