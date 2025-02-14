require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());
app.use(express.static('public'));

// Quando o Journey Builder aciona a Custom Activity
app.post('/execute', async (req, res) => {
    console.log("Executando a atividade...");

    const inArguments = req.body.arguments.execute.inArguments || [];

    // Encontra o webhook salvo na Custom Activity
    const webhookUrl = inArguments.find(arg => arg.webhookUrl)?.webhookUrl;

    if (!webhookUrl) {
        console.error("Erro: Nenhum webhook configurado.");
        return res.status(400).json({ success: false, message: "Nenhum webhook configurado." });
    }

    // Remove o webhookUrl dos argumentos para pegar apenas os dados da Data Extension
    const dadosParaEnvio = inArguments.filter(arg => !arg.webhookUrl);

    if (dadosParaEnvio.length === 0) {
        console.error("Erro: Nenhum dado encontrado na Data Extension.");
        return res.status(400).json({ success: false, message: "Nenhum dado encontrado na Data Extension." });
    }

    try {
        // Envia os dados para o webhook do n8n
        const response = await axios.post(webhookUrl, { data: dadosParaEnvio });

        console.log("Dados enviados para o webhook com sucesso!", response.data);

        res.json({ success: true });
    } catch (error) {
        console.error("Erro ao enviar para o webhook:", error);
        res.status(500).json({ success: false, message: "Erro ao enviar os dados para o webhook." });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

const path = require('path');

app.get('/activity/manifest.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'manifest.json'));
});

app.post('/validate', (req, res) => {
    console.log("Validando atividade...");
    res.json({ success: true });
});

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
