const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const webpayRoutes = require('./backend/routes');

// Middleware para parsear JSON (para la API de Webpay)
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'dist')));

// Endpoint de prueba
app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok' });
});

// Fallback para SPA (Vue Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use('/api', webpayRoutes);

app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});