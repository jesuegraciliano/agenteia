document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("chat-form");
    const input = document.getElementById("pergunta");
    const chatBox = document.getElementById("chat-box");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const pergunta = input.value.trim();
        if (!pergunta) return;

        // Exibe a pergunta no chat
        const perguntaHTML = `<p><strong>Você:</strong> ${pergunta}</p>`;
        chatBox.innerHTML += perguntaHTML;

        // Limpa o campo de input
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

            // Verifica se há resposta
            if (data.output) {
                const respostaHTML = `<p><strong>Agente IA:</strong> ${data.output}</p>`;
                chatBox.innerHTML += respostaHTML;
            } else {
                chatBox.innerHTML += `<p><strong>Agente IA:</strong> Ocorreu um erro ao obter resposta.</p>`;
            }

        } catch (error) {
            chatBox.innerHTML += `<p><strong>Erro:</strong> ${error.message}</p>`;
        }

        // Rolagem automática para a última mensagem
        chatBox.scrollTop = chatBox.scrollHeight;
    });
});
