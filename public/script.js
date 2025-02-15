document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM carregado!");

    const Postmonger = window.Postmonger;
    var connection = new Postmonger.Session();
    var payload = {};
    var webhookUrl = "";

    // 🔥 Garante que os elementos do DOM existem antes de continuar
    function waitForElements(callback) {
        const interval = setInterval(() => {
            const webhookInput = document.getElementById("webhookUrl");
            const saveButton = document.getElementById("save");
            const doneButton = document.getElementById("done");
            const loadingIndicator = document.getElementById("loading");

            if (webhookInput && saveButton && doneButton) {
                clearInterval(interval);
                console.log("✅ Elementos do DOM encontrados!");
                loadingIndicator.style.display = "none"; // 🔥 Para o loading
                callback(webhookInput, saveButton, doneButton);
            } else {
                console.warn("⏳ Aguardando elementos do DOM...");
            }
        }, 500);
    }

    // 🔥 Aguarda os elementos do DOM antes de conectar o Postmonger
    waitForElements((webhookInput, saveButton, doneButton) => {
        // ✅ Escuta o evento initActivity para capturar os dados da atividade
        connection.on('initActivity', function (data) {
            console.log("📢 Payload recebido:", data);
            payload = data || {};

            if (payload.arguments?.execute?.inArguments) {
                webhookUrl = payload.arguments.execute.inArguments.find(arg => arg.webhookUrl)?.webhookUrl || "";
            } else {
                console.warn("⚠️ inArguments não encontrado no payload. Criando um valor padrão.");
                webhookUrl = "";
                payload.arguments = payload.arguments || {};
                payload.arguments.execute = payload.arguments.execute || {};
                payload.arguments.execute.inArguments = [{}];
            }

            webhookInput.value = webhookUrl;
            loadingIndicator.style.display = "none"; // Para o loading
            connection.trigger('ready'); // 🔥 Agora só dispara quando o payload chega
        });

        // ✅ Atualiza os dados ao clicar no botão "Salvar"
        saveButton.addEventListener('click', function () {
            webhookUrl = webhookInput.value;

            var activityPayload = {
                name: payload.name || "Enviar para Webhook",
                id: payload.id || null,
                key: payload.key || "REST-1",
                type: "REST",
                configurationArguments: {
                    publish: { inArguments: [{ webhookUrl: webhookUrl }] },
                    validate: { inArguments: [{ webhookUrl: webhookUrl }] }
                },
                arguments: {
                    execute: {
                        inArguments: [{ webhookUrl: webhookUrl }],
                        outArguments: []
                    }
                }
            };

            console.log("📢 Enviando updateActivity:", activityPayload);
            connection.trigger('updateActivity', activityPayload);
        });

        // ✅ Quando o usuário clica em "Done"
        doneButton.addEventListener('click', function () {
            console.log("✅ Atividade configurada com sucesso!");
            connection.trigger('validateActivity');
        });

        // 🔥 Dispara o primeiro evento para garantir a conexão
        connection.trigger('initActivity');
    });
});