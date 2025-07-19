document.getElementById("chat-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const userInput = document.getElementById("user-input").value;
  addMessage("Você", userInput);

  try {
    const resposta = await fetch("https://hook.jesue.site/webhook/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pergunta: userInput })
    });

    // Adiciona verificação para respostas HTTP com erro (e.g., 404, 500)
    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status} ${resposta.statusText}`);
    }

    const dados = await resposta.json();

    // Garante que 'resposta' existe no retorno
    if (dados && dados.resposta) {
      addMessage("Agente IA", dados.resposta);
    } else {
      // Caso a resposta JSON não contenha o campo 'resposta' esperado
      addMessage("Agente IA", "Resposta do servidor em formato inesperado.");
    }

  } catch (erro) {
    // Captura erros de rede e erros HTTP lançados acima
    console.error("Erro ao acessar o agente:", erro); // Para depuração
    addMessage("Agente IA", `Erro ao acessar o agente: ${erro.message || "Tente novamente mais tarde."}`);
  }

  document.getElementById("user-input").value = "";
});

function addMessage(remetente, texto) {
  const chatBox = document.getElementById("chat-box");
  const p = document.createElement("p");
  // É mais seguro usar textContent para o texto do remetente e mensagem
  // para evitar injeção de HTML, a menos que você confie totalmente na fonte.
  // Mantenho innerHTML aqui pois você o estava usando, mas tenha isso em mente.
  p.innerHTML = `<strong>${remetente}:</strong> ${texto}`;
  chatBox.appendChild(p);
  // Rolagem automática para a última mensagem
  chatBox.scrollTop = chatBox.scrollHeight;
}
