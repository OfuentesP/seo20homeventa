require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;
const webpayRoutes = require('./backend/routes');

// Middleware CORS y JSON
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde 'dist' con headers de caché adecuados
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y',
  etag: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (filePath.endsWith('.js') || filePath.endsWith('.css')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    } else if (filePath.match(/\.(jpg|jpeg|png|gif|ico|svg|webp)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));

// Endpoint de prueba para monitoreo
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Rutas de Webpay API
app.use('/api', webpayRoutes);

// Fallback para SPA (Vue Router)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  console.log(`📄 Sirviendo SPA desde: ${indexPath}`);
  res.sendFile(indexPath);
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});