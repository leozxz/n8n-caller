require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS
app.use(cors({
    origin: '*',
    methods: 'GET,POST,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization'
}));

// Middleware para servir arquivos estáticos
app.use(express.static('public'));

// Content Security Policy para evitar bloqueios do Marketing Cloud
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy",
        "default-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; " +
        "script-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "connect-src *;");
    next();
});

// Servir arquivos
app.get('/activity/manifest.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'manifest.json'));
});

app.get('/activity/config.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'config.js'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota de validação
app.post('/validate', (req, res) => {
    console.log("✅ Validando atividade...");
    res.json({ success: true });
});

// Rota de execução da atividade
app.post('/execute', (req, res) => {
    console.log("✅ Executando a atividade...");

    const inArguments = req.body.arguments.execute.inArguments || [];
    const webhookUrl = inArguments.find(arg => arg.webhookUrl)?.webhookUrl;

    if (!webhookUrl) {
        return res.status(400).json({ success: false, message: "Nenhum webhook configurado." });
    }

    console.log("📤 Enviando para Webhook:", webhookUrl);
    res.json({ success: true });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
