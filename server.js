require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());
app.use(express.static('public'));

// Simulação de busca na Data Extension
async function buscarDadosDaDataExtension() {
    return [
        { email: "user1@email.com", nome: "Usuário 1", telefone: "11999999999" },
        { email: "user2@email.com", nome: "Usuário 2", telefone: "11988888888" }
    ];
}

// Quando o Journey Builder aciona a Custom Activity
app.post('/execute', async (req, res) => {
    console.log("Executando a atividade...");

    const webhookUrl = req.body.arguments.execute.inArguments.find(arg => arg.webhookUrl)?.webhookUrl;

    if (!webhookUrl) {
        console.error("Erro: Nenhum webhook configurado.");
        return res.status(400).json({ success: false, message: "Nenhum webhook configurado." });
    }

    try {
        const dados = await buscarDadosDaDataExtension();

        // Envia os dados para o webhook do n8n
        const response = await axios.post(webhookUrl, { data: dados });

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
