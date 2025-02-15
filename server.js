require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Habilita CORS
app.use(cors({
    origin: '*',
    methods: 'GET,POST,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization'
}));

// Middleware para servir arquivos estáticos corretamente
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Garante que Content-Security-Policy está bem definida
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy",
        "default-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; " +
        "script-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "connect-src *;");
    next();
});

// Servindo arquivos específicos corretamente
app.get('/activity/manifest.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'manifest.json'));
});

app.get('/activity/config.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'config.js'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});