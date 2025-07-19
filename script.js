const form = document.querySelector("form");
const input = document.querySelector("input");
const chat = document.querySelector("ul");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const pergunta = input.value.trim();
  if (pergunta === "") return;

  // Mostrar a pergunta no chat
  const msgUsuario = document.createElement("li");
  msgUsuario.innerHTML = `<strong>Você:</strong> ${pergunta}`;
  chat.appendChild(msgUsuario);

  // Resetar campo de entrada
  input.value = "";

  // Mostrar mensagem de carregando
  const msgIA = document.createElement("li");
  msgIA.innerHTML = `<strong>Agente IA:</strong> <em>pensando...</em>`;
  chat.appendChild(msgIA);

  try {
    const resposta = await fetch("https://editor.jesue.site/webhook/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: pergunta
      })
    });

    const respostaTexto = await resposta.text();

    msgIA.innerHTML = `<strong>Agente IA:</strong> ${respostaTexto}`;
  } catch (erro) {
    msgIA.innerHTML = `<strong>Agente IA:</strong> <span style="color: red;">Erro ao acessar o agente: ${erro.message}</span>`;
  }

  // Rolar até a última mensagem
  chat.scrollTop = chat.scrollHeight;
});
