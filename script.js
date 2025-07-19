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

    const dados = await resposta.json();

    // Garante que existe 'resposta' no retorno
    if (dados && dados.texto) {
      addMessage("Agente IA", dados.texto);
    } else {
      addMessage("Agente IA", "Resposta não encontrada no servidor.");
    }

  } catch (erro) {
    addMessage("Agente IA", "Erro ao acessar o agente. Tente novamente mais tarde.");
  }

  document.getElementById("user-input").value = "";
});

function addMessage(remetente, texto) {
  const chatBox = document.getElementById("chat-box");
  const p = document.createElement("p");
  p.innerHTML = `<strong>${remetente}:</strong> ${texto}`;
  chatBox.appendChild(p);
}
