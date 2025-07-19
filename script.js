document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const input = document.querySelector("input");
  const chatContainer = document.querySelector(".chat");

  // Função para adicionar mensagens no chat
  function adicionarMensagem(remetente, mensagem) {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${remetente}:</strong> ${mensagem}`;
    chatContainer.appendChild(p);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // Envio do formulário
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const perguntaUsuario = input.value.trim();
    if (perguntaUsuario === "") return;

    adicionarMensagem("Você", perguntaUsuario);
    input.value = "";

    // Envia para o webhook do N8N
    fetch("https://jesue.site/webhook/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chatInput: perguntaUsuario
      })
    })
      .then(response => {
        // Tenta transformar a resposta em JSON
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.output) {
          adicionarMensagem("Agente IA", data.output);
        } else {
          adicionarMensagem("Agente IA", "Nenhuma resposta recebida.");
        }
      })
      .catch(error => {
        console.error("Erro ao comunicar com o N8N:", error);
        adicionarMensagem("Erro", "Falha ao obter resposta do servidor.");
      });
  });
});
