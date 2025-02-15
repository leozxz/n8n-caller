console.log("Config.js carregado!");
define([], function() {
    return {
        "execute": {
            "inArguments": [{}],
            "outArguments": [],
            "url": "https://n8n-caller.onrender.com/execute",
            "verb": "POST",
            "body": "{}",
            "header": { "Content-Type": "application/json" }
        }
    };
});
