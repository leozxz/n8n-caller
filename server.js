require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔥 Permitir CORS Globalmente
app.use(cors({
  origin: '*',
  methods: 'GET,POST,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization'
}));

// 🔥 Middleware para permitir requisições do Marketing Cloud
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.setHeader("Content-Security-Policy", "default-src 'self'; connect-src *; script-src 'self'; style-src 'self';");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

// Servindo arquivos estáticos corretamente
app.use(express.static('public'));

// 🔥 Corrigindo a rota do `manifest.json`
app.get('/activity/manifest.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'manifest.json'));
});

// 🔥 Corrigindo a rota do `config.js`
app.get('/activity/config.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'config.js'));
});

// 🔥 Corrigindo o carregamento do Ícone
app.get('/icon.png', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'icon.png'));
});

// 🔥 Validação da Custom Activity
app.post('/validate', (req, res) => {
    console.log("Validando atividade...");
    res.json({ success: true });
});

// 🔥 Execução da Custom Activity
app.post('/execute', async (req, res) => {
    console.log("Executando a atividade...");

    const inArguments = req.body.arguments.execute.inArguments || [];
    const webhookUrl = inArguments.find(arg => arg.webhookUrl)?.webhookUrl;

    if (!webhookUrl) {
        return res.status(400).json({ success: false, message: "Nenhum webhook configurado." });
    }

    const dadosParaEnvio = inArguments.filter(arg => !arg.webhookUrl);

    try {
        const response = await axios.post(webhookUrl, { data: dadosParaEnvio });
        console.log("Dados enviados para o webhook com sucesso!", response.data);
        res.json({ success: true });
    } catch (error) {
        console.error("Erro ao enviar para o webhook:", error);
        res.status(500).json({ success: false, message: "Erro ao enviar os dados para o webhook." });
    }
});

// 🔥 Configurações adicionais do Marketing Cloud
app.post('/save', (req, res) => {
    console.log("Salvando atividade...");
    res.json({ success: true });
});

app.post('/publish', (req, res) => {
    console.log("Publicando atividade...");
    res.json({ success: true });
});

app.post('/stop', (req, res) => {
    console.log("Parando atividade...");
    res.json({ success: true });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

app.get('/activity/manifest.json', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.sendFile(path.join(__dirname, 'public', 'manifest.json'));
});

app.use(express.static('public'));
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});