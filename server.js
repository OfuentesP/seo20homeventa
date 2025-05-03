require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const webpayRoutes = require('./backend/routes');
const cors = require('cors');
app.use(cors());

// Middleware para parsear JSON (para la API de Webpay)
app.use(express.json());

// Serve static files with caching headers
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y',
  etag: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (path.endsWith('.js') || path.endsWith('.css')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    } else if (path.match(/\.(jpg|jpeg|png|gif|ico|svg|webp)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));

// Endpoint de prueba
app.get('/api/health', (req, res) => {
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