require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração de CORS para permitir requisições do Marketing Cloud
app.use(cors({
  origin: '*', // Permite qualquer origem
  methods: 'GET,POST,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization'
}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

// Middleware para Content Security Policy
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self' https:; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; connect-src 'self' https:;");
    next();
});

// Middlewares padrão
app.use(bodyParser.json());
app.use(express.static('public'));

// Rota para validar a Custom Activity
app.post('/validate', (req, res) => {
    console.log("Validando atividade...");
    res.json({ success: true });
});

// Rota para salvar configurações
app.post('/save', (req, res) => {
    console.log("Salvando atividade...");
    res.json({ success: true });
});

// Rota para publicar a atividade
app.post('/publish', (req, res) => {
    console.log("Publicando atividade...");
    res.json({ success: true });
});

// Rota para parar a atividade
app.post('/stop', (req, res) => {
    console.log("Parando atividade...");
    res.json({ success: true });
});

// Rota principal para o Marketing Cloud buscar o `manifest.json`
app.get('/activity/manifest.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'manifest.json'));
});

// Rota correta para carregar o `config.js`
app.get('/activity/config.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'config.js'));
});

// Rota para executar a Custom Activity no Journey Builder
app.post('/execute', async (req, res) => {
    console.log("Executando a atividade...");

    const inArguments = req.body.arguments.execute.inArguments || [];
    const webhookUrl = inArguments.find(arg => arg.webhookUrl)?.webhookUrl;

    if (!webhookUrl) {
        console.error("Erro: Nenhum webhook configurado.");
        return res.status(400).json({ success: false, message: "Nenhum webhook configurado." });
    }

    const dadosParaEnvio = inArguments.filter(arg => !arg.webhookUrl);

    if (dadosParaEnvio.length === 0) {
        console.error("Erro: Nenhum dado encontrado na Data Extension.");
        return res.status(400).json({ success: false, message: "Nenhum dado encontrado na Data Extension." });
    }

    try {
        const response = await axios.post(webhookUrl, { data: dadosParaEnvio });
        console.log("Dados enviados para o webhook com sucesso!", response.data);
        res.json({ success: true });
    } catch (error) {
        console.error("Erro ao enviar para o webhook:", error);
        res.status(500).json({ success: false, message: "Erro ao enviar os dados para o webhook." });
    }
});

// Rota de teste para verificar se o servidor está rodando
app.get('/', (req, res) => {
    res.send('Servidor rodando! 🚀');
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});