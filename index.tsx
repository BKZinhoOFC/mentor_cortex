import { GoogleGenAI, Chat } from "@google/genai";
import { marked } from "marked";

// The user prompt is the system instruction.
const systemInstruction = `
**Assuma a persona de "Mentor Córtex"**, um tutor de programação de classe mundial. Você é um especialista em engenharia de software e ciência da computação, mas sua verdadeira paixão é o ensino. Sua missão é me guiar, seu aluno, do zero ao nível profissional na linguagem de programação que eu escolher, utilizando uma metodologia de ensino inovadora, clara e extremamente eficaz.

**Suas Principais Diretrizes de Ensino são:**

1.  **Metodologia das Analogias Dinâmicas:** Para cada novo conceito, seja ele simples (como uma variável) ou complexo (como polimorfismo ou concorrência), você DEVE criar uma analogia ou metáfora clara e memorável para explicá-lo. Exemplo: Explicar uma API como um garçom que anota seu pedido (o request) e traz seu prato (a response) sem que você precise entrar na cozinha (o sistema).

2.  **Princípio da Concisão Ativa:** Suas explicações devem ser curtas, diretas e focadas. Evite jargões desnecessários. Após explicar um conceito, sempre me faça uma pergunta para verificar meu entendimento antes de prosseguir.

3.  **Aprendizagem Baseada em Projetos (ABP) Estruturada:** Nossa jornada será 100% prática. Você não vai apenas me ensinar a teoria; nós vamos construir projetos juntos. O processo é o seguinte:
    *   **Definição de Nível:** Primeiro, você me perguntará qual linguagem eu quero aprender e meu nível atual (Básico, Intermediário, Avançado).
    *   **Instruções Básicas:** Você ira explicar as funções mais básicas, variáveis, estruturas mais simples, pedir que o aluno envie cada código das instruções.
    *   **Familiarização:** Fará pequeneos exercícios e atividades simples com o aluno, para que ele possa se familiarizar com a linguagem e construir pequenos códigos antes de propor o projeto.
    *   **Proposta de Projeto:** Com base no meu nível, você irá propor um projeto principal.
        *   **Básico:** Projetos autocontidos em uma única linguagem. Ex: Jogo da Forca em Python, uma To-Do List com HTML/CSS/JavaScript.
        *   **Intermediário:** Projetos que integram uma ou duas tecnologias. Ex: Um blog simples com back-end em Node.js e front-end em HTML/CSS, usando um arquivo JSON como banco de dados.
        *   **Avançado:** Projetos complexos que simulam aplicações do mundo real. Ex: Um e-commerce básico com back-end em Java (Spring), front-end em React e um banco de dados SQL.
    *   **Acompanhamento Passo a Passo:** Você dividirá o projeto em módulos e etapas pequenas. Para cada etapa, você primeiro ensinará os conceitos necessários e, em seguida, me dará uma tarefa de codificação clara.

4.  **Mentor Socrático e Revisor de Código:** Quando eu apresentar meu código, você não vai apenas corrigi-lo. Sua abordagem será:
    *   **Primeiro, Pergunte:** Se houver um erro, pergunte-me o que eu acho que está errado ou por que escolhi aquela abordagem. Me guie à solução com perguntas.
    *   **Feedback Construtivo:** Aponte os erros e explique o porquê de estarem errados.
    *   **Melhores Práticas:** Sugira melhorias de estilo, eficiência (complexidade de algoritmo) e legibilidade (código limpo, nomes de variáveis, etc.).
    *   **Reforço Positivo:** Elogie o que foi feito corretamente para me manter motivado.

5.  **Flexibilidade e Aprofundamento:** Se eu tiver uma dúvida sobre um tópico específico, você deve ser capaz de pausar o projeto, aprofundar-se nesse tópico com a mesma metodologia didática e depois retomar o projeto.

**Início da Interação:**

**No início de uma conversa, se eu não fornecer um resumo, prossiga normalmente para as perguntas da linguagem queremos estudar.**

Para começar, apresente-se como "Mentor Córtex" e faça-me as duas perguntas iniciais:
1.  Qual linguagem de programação você gostaria de dominar?
2.  Qual você considera ser seu nível de experiência atual: **Básico** (nunca programei ou sei muito pouco), **Intermediário** (já entendo de lógica, loops, funções e quero construir projetos mais robustos) ou **Avançado** (domino a linguagem e quero aprender sobre arquitetura de software, padrões de projeto e otimização)?

A partir da minha resposta, proponha o projeto inicial e vamos começar nossa jornada.
`;

const messagesContainer = document.getElementById('messages') as HTMLDivElement;
const chatForm = document.getElementById('chat-form') as HTMLFormElement;
const chatInput = document.getElementById('chat-input') as HTMLTextAreaElement;
const sendButton = chatForm.querySelector('button') as HTMLButtonElement;
const voiceControls = document.getElementById('voice-controls') as HTMLDivElement;
const stopButton = document.getElementById('stop-btn') as HTMLButtonElement;
const toggleVoiceButton = document.getElementById('toggle-voice-btn') as HTMLButtonElement;
const downloadSummaryButton = document.getElementById('download-summary-btn') as HTMLButtonElement;

let ai: GoogleGenAI;
let chat: Chat;
let currentRate = 1.5;
let isVoiceEnabled = true;

// Function to speak text using the Web Speech API
function speak(text: string | null) {
    if (!isVoiceEnabled || !text || !window.speechSynthesis) {
        return;
    }

    // Cancel any previous speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = currentRate; // Use the current selected rate
    utterance.pitch = 1;

    // Attempt to find a higher quality voice
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;

    // Prioritize specific high-quality voices found in modern browsers
    selectedVoice = voices.find(voice => voice.name.includes('Francisca') && voice.lang === 'pt-BR') || // Edge/Windows
        voices.find(voice => voice.name === 'Google português do Brasil' && voice.lang === 'pt-BR') || // Chrome
        voices.find(voice => voice.lang === 'pt-BR'); // Fallback to any Brazilian Portuguese voice

    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    window.speechSynthesis.speak(utterance);
}

// Function to add a message to the chat window
function addMessage(sender: 'user' | 'model', text: string, isLoading = false): HTMLDivElement {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    if (isLoading) {
        messageElement.classList.add('loading');
    }
    // Using marked.parse to render Markdown
    messageElement.innerHTML = marked.parse(text) as string;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return messageElement;
}


// Main function to initialize the app
async function main() {
    // Configure marked to treat newlines as <br> tags
    marked.setOptions({
        breaks: true,
        gfm: true,
    });

    try {
        // Replace this with your method of providing the API key in the browser.
        // Example: Use a global variable or prompt the user for the API key.
        const apiKey = process.env.GEMINI_API_KEY;
        ai = new GoogleGenAI({ apiKey });
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
            },
        });

        // Display initial greeting
        const initialGreeting = `Olá! Eu sou o **Mentor Córtex**, seu tutor de programação pessoal. Minha missão é guiá-lo do zero ao nível profissional na linguagem que você escolher.

Para começarmos, por favor, me diga:

1.  Qual linguagem de programação você gostaria de dominar?
2.  Qual você considera ser seu nível de experiência atual: **Básico**, **Intermediário** ou **Avançado**?`;

        const greetingElement = addMessage('model', initialGreeting);

        // Speak the initial greeting. Voices may load asynchronously.
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = () => speak(greetingElement.textContent);
        } else {
            speak(greetingElement.textContent);
        }

    } catch (error) {
        console.error("Initialization error:", error);
        addMessage('model', 'Desculpe, não consegui inicializar. Verifique a chave da API e a configuração.');
    }

    chatForm.addEventListener('submit', handleFormSubmit);

    chatInput.addEventListener('keydown', (e) => {
        // Send on Enter, new line on Shift+Enter
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.requestSubmit();
        }
    });

    chatInput.addEventListener('input', () => {
        // Auto-resize textarea
        chatInput.style.height = 'auto';
        chatInput.style.height = `${chatInput.scrollHeight}px`;
    });

    setupVoiceControls();
}

function setupVoiceControls() {
    voiceControls.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        if (target.classList.contains('speed-btn')) {
            // Update rate
            currentRate = parseFloat(target.dataset.speed || '1.5');

            // Update active class
            voiceControls.querySelector('.speed-btn.active')?.classList.remove('active');
            target.classList.add('active');
        }
    });

    stopButton.addEventListener('click', () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    });

    toggleVoiceButton.addEventListener('click', () => {
        isVoiceEnabled = !isVoiceEnabled;
        if (isVoiceEnabled) {
            toggleVoiceButton.classList.add('active');
            toggleVoiceButton.setAttribute('aria-label', 'Desativar voz');
        } else {
            toggleVoiceButton.classList.remove('active');
            toggleVoiceButton.setAttribute('aria-label', 'Ativar voz');
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        }
    });

    downloadSummaryButton.addEventListener('click', handleDownloadSummary);
}

async function handleDownloadSummary() {
    downloadSummaryButton.disabled = true;

    try {
        const messages = Array.from(messagesContainer.querySelectorAll('.message'));
        if (messages.length <= 1) {
            alert("Não há conteúdo de conversa suficiente para criar um resumo.");
            return;
        }

        let conversationHistory = '';
        messages.forEach(msg => {
            const role = msg.classList.contains('user-message') ? 'Aluno' : 'Mentor Córtex';
            const messageText = (msg as HTMLElement).innerText;
            conversationHistory += `${role}:\n${messageText}\n\n`;
        });

        const summarizationPrompt = `
            Com base no seguinte diálogo entre "Mentor Córtex" e um aluno, crie um resumo conciso da sessão de aprendizado. O resumo deve ser em formato de texto simples (.txt) e focar nos seguintes pontos:
            1.  **Linguagem e Nível:** Identifique a linguagem de programação e o nível de habilidade do aluno.
            2.  **Conceitos Chave:** Liste os principais conceitos de programação abordados.
            3.  **Progresso do Projeto:** Descreva o progresso feito no projeto proposto (se aplicável).
            4.  **Pontos de Dificuldade:** Mencione quaisquer dificuldades ou erros comuns que o aluno enfrentou.
            5.  **Próximos Passos:** Sugira os próximos passos lógicos para a próxima sessão de estudo.

            Este resumo será usado para continuar a aula em uma sessão futura, então deve ser claro e informativo.

            **Histórico da Conversa:**
            ---
            ${conversationHistory}
            ---
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: summarizationPrompt,
        });

        const summaryText = response.text;

        const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resumo-aula-cortex.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Summary generation error:", error);
        addMessage('model', 'Desculpe, não consegui gerar o resumo. Por favor, tente novamente.');
    } finally {
        downloadSummaryButton.disabled = false;
    }
}


async function handleFormSubmit(e: Event) {
    e.preventDefault();
    const userInput = chatInput.value.trim();

    if (!userInput) return;

    // Stop any currently speaking utterance
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }

    toggleForm(true);
    addMessage('user', userInput);
    chatInput.value = '';
    chatInput.style.height = 'auto'; // Reset textarea height

    const modelMessageElement = addMessage('model', '', true);
    let fullResponse = '';

    try {
        const result = await chat.sendMessageStream({ message: userInput });

        for await (const chunk of result) {
            fullResponse += chunk.text;
            // Update the message element with the parsed markdown of the streaming text
            modelMessageElement.innerHTML = marked.parse(fullResponse + '▋') as string;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        // Final update without the cursor
        modelMessageElement.innerHTML = marked.parse(fullResponse) as string;
        modelMessageElement.classList.remove('loading');

        // Speak the final response
        speak(modelMessageElement.textContent);

    } catch (error) {
        console.error("API Error:", error);
        modelMessageElement.innerHTML = "Desculpe, ocorreu um erro ao tentar obter uma resposta. Por favor, tente novamente.";
        modelMessageElement.classList.remove('loading');
    } finally {
        toggleForm(false);
    }
}

function toggleForm(disabled: boolean) {
    chatInput.disabled = disabled;
    sendButton.disabled = disabled;
}

// Start the application
main();