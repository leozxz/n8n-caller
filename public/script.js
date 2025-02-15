document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM carregado!");

    const Postmonger = window.Postmonger;
    var connection = new Postmonger.Session();
    var payload = {};
    var webhookUrl = "";

    // 🔥 Desativa o loading se existir
    function stopLoading() {
        const loadingIndicator = document.getElementById("loading");
        if (loadingIndicator) {
            loadingIndicator.style.display = "none";
        }
    }

    // 🔥 Verifica se os elementos do DOM existem antes de rodar
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

    // 🔥 Aguarda elementos do DOM antes de rodar lógica
    waitForElements((webhookInput, saveButton, doneButton) => {
        // ✅ Escuta o evento initActivity para capturar os dados da atividade
        connection.on('initActivity', function (data) {
            console.log("📢 Payload recebido:", data);
            payload = data || {};

            // 🔥 Se `arguments.execute.inArguments` não existir, cria um fallback
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
            stopLoading(); // 🔥 Remove o loading

            // 🔥 Dispara o evento de pronto
            connection.trigger('ready');
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

        // 🔥 Dispara `initActivity` para garantir que os dados sejam carregados
        connection.trigger('initActivity');
    });
});
