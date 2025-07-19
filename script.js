document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("chat-form");
    const input = document.getElementById("user-input"); // Corrigido aqui
    const chatBox = document.getElementById("chat-box");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const pergunta = input.value.trim();
        if (!pergunta) return;

        // Mostra a pergunta do usuário
        chatBox.innerHTML += `<p><strong>Você:</strong> ${pergunta}</p>`;
        input.value = "";

        try {
            const response = await fetch("https://editor.jesue.site/webhook/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ pergunta: pergunta })
            });

            const data = await response.json();

            // Mostra a resposta do agente
            if (data.output) {
                chatBox.innerHTML += `<p><strong>Agente IA:</strong> ${data.output}</p>`;
            } else {
                chatBox.innerHTML += `<p><strong>Agente IA:</strong> Nenhuma resposta recebida.</p>`;
            }
        } catch (error) {
            chatBox.innerHTML += `<p><strong>Erro:</strong> ${error.message}</p>`;
        }

        chatBox.scrollTop = chatBox.scrollHeight;
    });
});
