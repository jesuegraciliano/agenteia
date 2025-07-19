document.getElementById("chat-form").addEventListener("submit", async function (e) {
  e.preventDefault(); // Impede o envio padrão do formulário (que recarregaria a página)

  // Obtém o valor da entrada do usuário e remove espaços em branco extras no início/fim
  const userInput = document.getElementById("user-input").value.trim();

  // Se o campo estiver vazio (mesmo após trim), não faz nada.
  // O atributo 'required' no HTML já lida com a validação visual do navegador.
  if (userInput === "") {
    return;
  }

  addMessage("Você", userInput); // Adiciona a mensagem do usuário ao chat

  // --- NOVO: GERAR OU RECUPERAR UM SESSION ID ---
  // Este ID é usado para o n8n saber qual "conversa" é esta.
  // Tentamos pegar um ID já salvo (para a mesma sessão do navegador).
  // Se não houver, criamos um novo com base na data/hora atual (garante que seja único).
  let sessionId = localStorage.getItem("chatSessionId");
  if (!sessionId) {
      sessionId = "user_" + Date.now(); // Ex: "user_1678888888888"
      localStorage.setItem("chatSessionId", sessionId); // Salva para reutilizar em futuras mensagens da mesma sessão
  }
  // --- FIM DO NOVO TRECHO ---

  try {
    // Faz a requisição POST para o seu webhook do n8n
    const resposta = await fetch("https://hook.jesue.site/webhook/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // --- CORREÇÃO: ENVIANDO A PERGUNTA E O SESSION ID ---
      body: JSON.stringify({ pergunta: userInput, sessionId: sessionId }) // AGORA INCLUI O 'sessionId'!
    });

    // --- TRATAMENTO ROBUSTO DE ERROS HTTP ---
    // Se a resposta HTTP não for bem-sucedida (ex: status 400, 404, 500), lança um erro.
    if (!resposta.ok) {
      let errorMessage = `Erro HTTP: ${resposta.status} ${resposta.statusText}.`;
      try {
        // Tenta ler o JSON de erro do servidor para uma mensagem mais específica (útil para 4xx/5xx)
        const errorData = await resposta.json();
        if (errorData && (errorData.message || errorData.error)) {
          errorMessage += ` Detalhes: ${errorData.message || errorData.error}`;
        }
      } catch (jsonError) {
        // Ignora se não conseguir parsear o JSON de erro (pode ser texto simples ou vazio em caso de erro)
      }
      throw new Error(errorMessage); // Lança o erro para ser capturado pelo bloco 'catch'
    }

    const dados = await resposta.json(); // Converte a resposta JSON do n8n para um objeto JavaScript

    // --- CORREÇÃO: EXTRAINDO A RESPOSTA DA CHAVE 'output' DO N8N ---
    // Baseado nos seus screenshots, o n8n retorna a resposta da IA na chave "output".
    const textoDoAgente = dados.output; 

    if (textoDoAgente) { // Verifica se 'textoDoAgente' tem algum conteúdo (não é undefined, null ou string vazia)
      addMessage("Agente IA", textoDoAgente); // Adiciona a resposta do Agente IA ao chat
    } else {
      // Mensagem para quando o n8n responde com 200 OK, mas a chave 'output' está ausente ou vazia
      addMessage("Agente IA", "Resposta do servidor em formato inesperado ou vazia (a chave 'output' não foi encontrada ou estava vazia no N8N).");
    }

  } catch (erro) {
    // Este bloco captura erros de rede (ex: sem internet) e os erros HTTP que lançamos acima
    console.error("Erro ao acessar o agente:", erro); // Loga o erro completo no console do navegador (F12)
    addMessage("Agente IA", `Erro ao acessar o agente: ${erro.message || "Problema de conexão ou servidor. Tente novamente mais tarde."}`);
  }

  // Limpa o campo de entrada após enviar a mensagem, independentemente do resultado
  document.getElementById("user-input").value = "";
});

// Função auxiliar para adicionar mensagens à caixa de chat
function addMessage(remetente, texto) {
  const chatBox = document.getElementById("chat-box");
  const p = document.createElement("p");
  // Usamos innerHTML para formatar o negrito. Para texto puro sem formatação HTML, textContent é mais seguro.
  p.innerHTML = `<strong>${remetente}:</strong> ${texto}`;
  chatBox.appendChild(p);
  // Garante que a caixa de chat role para a última mensagem adicionada
  chatBox.scrollTop = chatBox.scrollHeight;
}
