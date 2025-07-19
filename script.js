document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');

    // !!! IMPORTANTE: Substitua esta URL pela URL REAL do seu Webhook do n8n !!!
    // Ela deve ser: https://hook.jesue.site/webhook/chat
    const N8N_WEBHOOK_URL = "https://hook.jesue.site/webhook/chat"; // <--- ESTA LINHA É CRÍTICA

    // Função para adicionar uma mensagem ao chat
    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        if (sender === 'user') {
            messageDiv.classList.add('user-message');
        } else {
            messageDiv.classList.add('bot-message');
        }
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Rola para o final
    }

    // Gerar um ID de sessão simples para fins de exemplo
    const sessionId = `session_${Date.now()}`; 

    // Função para enviar a pergunta
    async function sendMessage() {
        const question = userInput.value.trim();
        if (question === '') {
            return;
        }

        addMessage('user', question);
        userInput.value = ''; // Limpa a entrada

        // Desabilita o input e o botão enquanto espera a resposta
        userInput.disabled = true;
        sendButton.disabled = true;

        // Esta é a validação que está falhando no seu site
        if (N8N_WEBHOOK_URL === "SUA_URL_DO_WEBHOOK_DO_N8N_AQUI" || !N8N_WEBHOOK_URL) {
            addMessage('bot', 'ERRO: A URL do webhook do n8n não foi configurada. Por favor, edite script.js.');
            userInput.disabled = false;
            sendButton.disabled = false;
            return;
        }

        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ pergunta: question, sessionId: sessionId })
            });

            const data = await response.json();

            if (response.ok) {
                addMessage('bot', data.output || 'Desculpe, não consegui obter uma resposta do AI.');
            } else {
                addMessage('bot', `Erro: ${data.error || 'Não foi possível obter uma resposta.'}`);
            }

        } catch (error) {
            console.error('Erro ao comunicar com o n8n webhook:', error);
            addMessage('bot', 'Ocorreu um erro ao tentar conectar com o serviço de IA. Verifique sua conexão ou a URL do n8n.');
        } finally {
            // Reabilita o input e o botão
            userInput.disabled = false;
            sendButton.disabled = false;
            userInput.focus(); // Coloca o foco de volta no input
        }
    }

    sendButton.addEventListener('click', sendMessage);

    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // Mensagem de boas-vindas inicial
    addMessage('bot', 'Olá! Sou o chatbot do curso de IA. Como posso ajudar você hoje?');
});
