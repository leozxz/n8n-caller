require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔥 Middleware para permitir CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// 🔥 Rota principal que pega dados da Data Extension e envia ao webhook
app.get('/', async (req, res) => {
    try {
        console.log("📢 Buscando dados da Data Extension...");

        // 🔥 Simulando a consulta à Data Extension
        const dataExtensionData = [
            { email: "teste1@email.com", nome: "Usuário 1", telefone: "11987654321" },
            { email: "teste2@email.com", nome: "Usuário 2", telefone: "21987654321" }
        ];

        console.log("✅ Dados obtidos:", dataExtensionData);

        // 🔥 Enviando para o Webhook
        const response = await axios.post("https://n8n-prd.ogrupoprimo.com/webhook/custom-mktCloud", {
            data: dataExtensionData
        });

        console.log("✅ Dados enviados com sucesso!", response.data);

        res.send("✅ Dados enviados com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao enviar os dados:", error);
        res.status(500).send("Erro ao enviar os dados.");
    }
});

// 🔥 Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
