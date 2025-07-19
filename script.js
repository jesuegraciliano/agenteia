document.getElementById("chat-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const userInput = document.getElementById("user-input").value;
  addMessage("Você", userInput);

  try {
    const resposta = await fetch("https://editor.jesue.site/webhook-test/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pergunta: userInput }) // ajuste conforme seu webhook
});

    const dados = await resposta.json();
    addMessage("Agente IA", dados.resposta || "Resposta não encontrada.");
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
  chatBox.scrollTop = chatBox.scrollHeight;
}
