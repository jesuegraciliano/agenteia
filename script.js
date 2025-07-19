document.getElementById("chat-form").addEventListener("submit", async function (e) {
  e.preventDefault(); // Impede o envio padrão do formulário (que recarregaria a página)

  const userInput = document.getElementById("user-input").value;
  addMessage("Você", userInput); // Adiciona a mensagem do usuário ao chat

  try {
    // Faz a requisição para o seu webhook
    const resposta = await fetch("https://hook.jesue.site/webhook/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pergunta: userInput }) // Envia a pergunta do usuário
    });

    // *** MELHORIA IMPORTANTE AQUI ***
    // Verifica se a resposta HTTP foi OK (status 200-299).
    // Se for um erro HTTP (404, 500, etc.), lança um erro para o bloco 'catch'.
    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status} ${resposta.statusText}. Verifique seu webhook.`);
    }

    const dados = await resposta.json(); // Tenta converter a resposta para JSON

    // Verifica se os 'dados' existem E se a propriedade 'resposta' existe dentro deles
    if (dados && dados.resposta) {
      addMessage("Agente IA", dados.resposta); // Adiciona a resposta do Agente IA ao chat
    } else {
      // Se não houver 'dados.resposta', indica um formato inesperado
      addMessage("Agente IA", "Resposta do servidor em formato inesperado. Verifique o JSON retornado pelo webhook.");
    }

  } catch (erro) {
    // Este bloco captura erros de rede (ex: sem internet) OU erros HTTP que lançamos acima
    console.error("Erro ao acessar o agente:", erro); // Para você ver no console do navegador (F12)
    addMessage("Agente IA", `Erro ao acessar o agente: ${erro.message || "Problema de conexão. Tente novamente mais tarde."}`);
  }

  // Limpa o campo de entrada após enviar a mensagem
  document.getElementById("user-input").value = "";
});

function addMessage(remetente, texto) {
  const chatBox = document.getElementById("chat-box");
  const p = document.createElement("p");
  p.innerHTML = `<strong>${remetente}:</strong> ${texto}`;
  chatBox.appendChild(p);
  // Rola automaticamente a caixa de chat para a última mensagem
  chatBox.scrollTop = chatBox.scrollHeight;
}
