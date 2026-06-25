# Teste Manual do Formulário de Contato

Este documento descreve as etapas para testar manualmente as validações, o envio e a proteção anti-spam (Honeypot) do formulário de contato.

## Pré-requisitos

1. Inicie o servidor de desenvolvimento ou preview local:
   ```bash
   pnpm run preview
   # ou
   pnpm run dev
   ```
2. Abra o navegador em `http://localhost:4321/contato`.
3. Abra as ferramentas de desenvolvedor (F12) na aba **Network (Rede)** para inspecionar as requisições AJAX.

---

## Caso de Teste 1: Envio com Dados Válidos (Sucesso)

1. Preencha todos os campos obrigatórios com informações válidas:
   - **Nome Completo**: `Cliente Teste`
   - **E-mail Corporativo**: `teste@empresa.com`
   - **Telefone / WhatsApp**: `(11) 99999-9999` (verifique se a máscara do IMask foi aplicada corretamente ao focar no campo)
   - **Como podemos ajudar?**: `Mensagem de teste de integração.`
2. Clique no botão **Enviar Mensagem**.
3. **Resultados Esperados**:
   - O botão de envio fica desabilitado e com opacidade reduzida enquanto a requisição é processada.
   - O banner de sucesso fica visível (`status-success`) com a mensagem: `"Mensagem enviada com sucesso! Entraremos em contato em breve."`.
   - O formulário é limpo (`form.reset()`).
   - Na aba **Network**, há uma requisição `POST` para `/api/submit-form` (ou a URL definida em `site.webhook.contact`).
   - O payload enviado é um JSON contendo:
     ```json
     {
       "name": "Cliente Teste",
       "email": "teste@empresa.com",
       "phone": "(11) 99999-9999",
       "message": "Mensagem de teste de integração.",
       "submittedAt": "2026-06-06T..."
     }
     ```

---

## Caso de Teste 2: Proteção Anti-Spam (Honeypot Ativo)

O campo Honeypot é ocultado visualmente e de leitores de tela para que apenas bots o preencham.

1. Para simular um bot, inspecione a página e localize o input invisível do Honeypot. Ele possui o atributo `name="username"`.
2. Remova temporariamente o atributo `style="display:none"` (ou insira um valor usando o console do desenvolvedor):
   ```javascript
   document.getElementsByName('username')[0].value = 'bot-spam';
   ```
3. Preencha o restante dos campos normais e envie o formulário.
4. **Resultados Esperados**:
   - O JavaScript do formulário intercepta o envio e detecta que o campo `username` está preenchido.
   - O formulário exibe uma resposta de sucesso silenciosa para enganar o bot: `"Mensagem enviada com sucesso!"`.
   - O formulário é limpo.
   - **Nenhuma requisição de rede (`POST`) para a API/webhook é realizada**, provando que o envio foi abortado com sucesso.

---

## Caso de Teste 3: Erro de API/Rede

1. Bloqueie temporariamente as requisições para `/api/submit-form` usando a ferramenta de desenvolvedor do navegador (Network -> Request blocking -> Block request URL).
2. Preencha o formulário e clique em **Enviar Mensagem**.
3. **Resultados Esperados**:
   - A requisição falha.
   - A mensagem de erro é exibida no banner (`status-error`): `"Erro ao enviar a mensagem. Por favor, tente novamente ou entre em contato diretamente."`.
   - O botão de envio é re-habilitado para que o usuário possa tentar novamente.
