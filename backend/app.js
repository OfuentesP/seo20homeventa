require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const routesPath = path.resolve('./routes');
console.log('[📦 Cargando rutas desde]', routesPath);

const routes = require('./routes'); // Solo una vez

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Monta las rutas bajo /api
app.use('/api', routes);

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});