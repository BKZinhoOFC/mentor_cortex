# Mentor Córtex - Seu Tutor de Programação com IA

Uma aplicação de chat interativa que atua como um tutor de programação pessoal, utilizando o poder da API do Google Gemini para oferecer uma experiência de aprendizado guiada e baseada em projetos.

<div align="center"> <!-- Badges --> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/> <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white" alt="Vite"/> <img src="https://img.shields.io/badge/google%20gemini-8E75B2?style=for-the-badge&logo=google%20gemini&logoColor=white" alt="Google Gemini"/></div>

## 🎯 Sobre o Projeto

**Mentor Córtex** é uma aplicação web que simula um tutor de programação de classe mundial. Utilizando um prompt de sistema detalhado para guiar o modelo Gemini do Google, a aplicação oferece uma metodologia de ensino socrática e prática. O objetivo é guiar estudantes de todos os níveis (do básico ao avançado) na jornada para dominar uma nova linguagem de programação, construindo projetos reais passo a passo.

### 🎥 Demonstração

<div align="center"> <img src="https://i.postimg.cc/Lstq9Brn/mentorcortex.gif" alt="Demonstração animada do Mentor Córtex em ação" width="500"/> <p><i>Demonstração animada do Mentor Córtex em ação.</i></p> </div>

## ✨ Funcionalidades Principais

-   🤖 **Persona de Tutor Especialista**: O Mentor Córtex assume a persona de um engenheiro de software sênior, tornando o aprendizado mais engajador e confiável.
    
-   🏗️ **Aprendizagem Baseada em Projetos**: A metodologia é 100% prática, propondo projetos adequados ao nível de experiência do aluno.
    
-   🗣️ **Interação por Voz**: As respostas do mentor podem ser lidas em voz alta com a API de Síntese de Voz do navegador, incluindo controles de velocidade.
    
-   ✅ **Revisão de Código Socrática**: Em vez de apenas corrigir, o mentor faz perguntas para guiar o aluno à solução, ensinando as melhores práticas.
    
-   📄 **Download de Resumo**: Ao final de uma sessão, é possível gerar e baixar um resumo em `.txt` com os principais pontos aprendidos para referência futura.
    
-   🎨 **Interface Responsiva e Moderna**: A interface de chat é limpa, construída com um tema escuro agradável e se adapta a diferentes tamanhos de tela.
    
-   📝 **Suporte a Markdown**: As respostas do modelo, incluindo blocos de código, são renderizadas corretamente para facilitar a leitura.
    

## 🛠️ Tecnologias Utilizadas

-   **Frontend**: HTML5, CSS3, TypeScript
    
-   **Bundler**: [Vite](https://vitejs.dev/ "null")
    
-   **Inteligência Artificial**: [Google Gemini API](https://ai.google.dev/ "null") via SDK `@google/genai`
    
-   **Renderização de Markdown**: [Marked.js](https://marked.js.org/ "null")
    

## 🚀 Instalação e Execução Local

Para executar este projeto localmente, siga os passos abaixo.

### Pré-requisitos

-   [Node.js](https://nodejs.org/ "null") (versão 18 ou superior)
    
-   Um editor de código de sua preferência (ex: [VS Code](https://code.visualstudio.com/ "null"))
    

### Passos

**1. Clone o Repositório**

```
git clone [https://github.com/seu-usuario/mentor-cortex.git](https://github.com/seu-usuario/mentor-cortex.git)
cd mentor-cortex

```

**2. Instale as Dependências**

Use o `npm` (ou seu gerenciador de pacotes preferido) para instalar as dependências do projeto.

```
npm install

```

**3. Configure a Chave de API do Gemini**

A aplicação precisa de uma chave de API para se comunicar com o modelo do Google Gemini.

-   **Copie o arquivo de exemplo**: Renomeie ou copie o arquivo `.env.example` para `.env`.
    
    ```
    cp .env.example .env
    
    ```
    
-   **Adicione sua chave**: Abra o novo arquivo `.env` e substitua `your-api-key` pela sua chave de API real.
    
    ```
    GEMINI_API_KEY=sua-chave-api-aqui
    
    ```
    
-   **Como obter uma chave de API?**
    
    1.  Acesse o [**Google AI Studio**](https://aistudio.google.com/ "null").
        
    2.  Clique em "**Get API key**" no menu lateral e crie uma nova chave se necessário.
        
    3.  Copie a chave gerada e cole-a em seu arquivo `.env`.
        

**4. Execute a Aplicação**

Com tudo configurado, inicie o servidor de desenvolvimento.

```
npm run dev

```

Abra seu navegador e acesse `http://localhost:5173` (ou a porta indicada no terminal) para começar a aprender com o Mentor Córtex!

## ⚙️ Como Funciona

O coração do Mentor Córtex está na variável `systemInstruction` dentro do arquivo `index.tsx`. Este é um **prompt de sistema** detalhado que instrui o modelo Gemini sobre como ele deve se comportar, qual persona adotar, qual metodologia de ensino seguir e como interagir com o usuário. Toda a lógica da aplicação, desde a saudação inicial até a revisão de código, é governada por estas instruções, garantindo uma experiência de aprendizado consistente e de alta qualidade.

### Scripts Disponíveis

-   `npm run dev`: Inicia o servidor de desenvolvimento com hot reload.
    
-   `npm run build`: Compila e otimiza a aplicação para produção.
    
-   `npm run preview`: Inicia um servidor local para visualizar a build de produção.
    

## 🤝 Contribuições

Contribuições são bem-vindas! Se você tiver ideias para novas funcionalidades, melhorias na didática do mentor ou correções de bugs, sinta-se à vontade para abrir uma _issue_ ou enviar um _pull request_.

1.  Faça um _Fork_ do projeto
    
2.  Crie sua _Feature Branch_ (`git checkout -b feature/AmazingFeature`)
    
3.  Faça o _Commit_ de suas mudanças (`git commit -m 'Add some AmazingFeature'`)
    
4.  Faça o _Push_ para a _Branch_ (`git push origin feature/AmazingFeature`)
    
5.  Abra um _Pull Request_
    

## 📄 Licença

Distribuído sob a licença MIT. Veja [**LICENSE**](https://github.com/BKZinhoOFC/mentor_cortex/blob/main/LICENSE "null") para mais informações.