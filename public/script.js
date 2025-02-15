document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM carregado!");

    const Postmonger = window.Postmonger;
    var connection = new Postmonger.Session();
    var payload = {};
    var webhookUrl = "";

    // 🔥 Remove o loading quando os elementos estão prontos
    function stopLoading() {
        const loadingIndicator = document.getElementById("loading");
        if (loadingIndicator) {
            loadingIndicator.style.display = "none";
        }
    }

    // 🔥 Aguarda elementos do DOM antes de iniciar
    function waitForElements(callback) {
        const interval = setInterval(() => {
            const webhookInput = document.getElementById("webhookUrl");
            const saveButton = document.getElementById("save");
            const doneButton = document.getElementById("done");

            if (webhookInput && saveButton && doneButton) {
                clearInterval(interval);
                console.log("✅ Elementos do DOM encontrados!");
                stopLoading();
                callback(webhookInput, saveButton, doneButton);
            } else {
                console.warn("⏳ Aguardando elementos do DOM...");
            }
        }, 500);
    }

    // 🔥 Aguarda os elementos do DOM antes de rodar a lógica
    waitForElements((webhookInput, saveButton, doneButton) => {

        // ✅ Captura os dados da atividade
        connection.on('initActivity', function (data) {
            console.log("📢 Payload recebido:", data);
            payload = data || {};

            if (payload.arguments?.execute?.inArguments) {
                webhookUrl = payload.arguments.execute.inArguments.find(arg => arg.webhookUrl)?.webhookUrl || "";
            } else {
                console.warn("⚠️ inArguments não encontrado. Criando valor padrão.");
                webhookUrl = "";
                payload.arguments = payload.arguments || {};
                payload.arguments.execute = payload.arguments.execute || {};
                payload.arguments.execute.inArguments = [{ webhookUrl: "" }];
            }

            webhookInput.value = webhookUrl;
            stopLoading();
            connection.trigger('ready'); // 🔥 Dispara evento de pronto
        });

        // ✅ Atualiza os dados ao clicar em "Salvar"
        saveButton.addEventListener('click', function () {
            webhookUrl = webhookInput.value;

            var activityPayload = {
                name: payload.name || "Enviar para Webhook",
                id: payload.id || null,
                key: payload.key || "REST-1",
                type: "REST",
                metaData: {
                    isConfigured: true // 🔥 Garante que o Marketing Cloud reconheça a configuração
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

        // 🔥 Garante que `initActivity` seja chamado corretamente
        setTimeout(() => {
            connection.trigger('initActivity');
        }, 500);
    });
});
