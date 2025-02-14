require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Endpoint para validar a atividade no Journey Builder
app.post('/validate', (req, res) => {
    console.log("Validando atividade...");
    res.json({ success: true });
});

// Endpoint chamado quando a atividade é salva no Journey Builder
app.post('/save', (req, res) => {
    console.log("Salvando configuração da atividade...");
    res.json({ success: true });
});

// Endpoint chamado quando a atividade é publicada no Journey Builder
app.post('/publish', (req, res) => {
    console.log("Publicando atividade...");
    res.json({ success: true });
});

// Endpoint principal: Executado quando a atividade roda dentro do Journey
app.post('/execute', (req, res) => {
    console.log("Executando a atividade...", req.body);

    // Aqui você pode processar os dados recebidos do Journey
    const eventData = req.body;
    
    // Responde com um status de sucesso
    res.json({ success: true });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
