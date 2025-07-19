document.getElementById("chat-form").addEventListener("submit", async function (e) {
  e.preventDefault(); // Impede o envio padrão do formulário (que recarregaria a página)

  // Obtém o valor da entrada do usuário e remove espaços em branco no início/fim
  const userInput = document.getElementById("user-input").value.trim();

  // Se o campo estiver vazio (mesmo após trim), não faz nada.
  // O atributo 'required' no HTML já lida com a validação visual do navegador.
  if (userInput === "") {
    return;
  }

  addMessage("Você", userInput); // Adiciona a mensagem do usuário ao chat

  try {
    // Faz a requisição POST para o seu webhook do n8n
    const resposta = await fetch("https://hook.jesue.site/webhook/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pergunta: userInput }) // Envia a pergunta do usuário como JSON
    });

    // --- TRATAMENTO ROBUSTO DE ERROS HTTP ---
    // Se a resposta HTTP não for bem-sucedida (ex: status 400, 404, 500), lança um erro.
    if (!resposta.ok) {
      let errorMessage = `Erro HTTP: ${resposta.status} ${resposta.statusText}.`;
      try {
        // Tenta ler o JSON de erro do servidor para uma mensagem mais específica
        const errorData = await resposta.json();
        if (errorData && (errorData.message || errorData.error)) {
          errorMessage += ` Detalhes: ${errorData.message || errorData.error}`;
        }
      } catch (jsonError) {
        // Ignora se não conseguir parsear o JSON de erro (pode ser texto simples de erro)
      }
      throw new Error(errorMessage); // Lança o erro para o bloco catch
    }

    const dados = await resposta.json(); // Converte a resposta JSON do n8n para um objeto JavaScript

    // --- PONTO CRÍTICO CORRIGIDO: EXTRAINDO A RESPOSTA DO N8N ---
    // Com base no seu screenshot do n8n, a resposta da IA está na chave "output".
    const textoDoAgente = dados.output; // <-- AGORA PEGANDO 'output' em vez de 'resposta'

    if (textoDoAgente) { // Verifica se 'textoDoAgente' tem algum conteúdo (não é undefined, null ou string vazia)
      addMessage("Agente IA", textoDoAgente); // Adiciona a resposta do Agente IA ao chat
    } else {
      // Mensagem para quando o n8n responde, mas a chave 'output' está ausente ou vazia
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
  // Usamos innerHTML para formatar o negrito, mas para texto puro é mais seguro usar textContent
  // Se o 'texto' puder vir de uma fonte não confiável e conter HTML malicioso, considere sanitizá-lo
  p.innerHTML = `<strong>${remetente}:</strong> ${texto}`;
  chatBox.appendChild(p);
  // Garante que a caixa de chat role para a última mensagem adicionada
  chatBox.scrollTop = chatBox.scrollHeight;
}
