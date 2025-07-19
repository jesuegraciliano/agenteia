document.getElementById('chat-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const input = document.getElementById('user-input');
  const pergunta = input.value.trim();
  if (!pergunta) return;

  appendMessage('Você', pergunta, 'user');
  input.value = '';

  try {
    const response = await fetch('https://editor.jesue.site/webhook/webhook_chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pergunta })
    });

    const data = await response.json();
    const resposta = data.output || 'Erro: resposta vazia do agente.';
    appendMessage('Agente IA', resposta, 'bot');
  } catch (error) {
    appendMessage('Agente IA', `Erro ao acessar o agente: ${error.message}`, 'bot');
  }
});

function appendMessage(nome, texto, classe) {
  const chatBox = document.getElementById('chat-box');
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', classe);
  msgDiv.innerHTML = `<strong>${nome}:</strong> ${texto}`;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}
