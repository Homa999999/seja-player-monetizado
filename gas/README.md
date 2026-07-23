# CMS no Google Apps Script

Use o Google Apps Script como backend do Player Monetizado (admin + conteúdo da landing).

## Por que Apps Script?

- Grátis e familiar se você já usa GAS
- Admin roda no Google (`google.script.run` — sem problema de CORS)
- A landing no GitHub Pages busca o JSON via **JSONP** (funciona cross-origin)

## Passo a passo

### 1. Criar o projeto

1. Abra [script.google.com](https://script.google.com)
2. **Novo projeto**
3. Copie o conteúdo de `Code.gs` → arquivo `Código.gs`
4. **Arquivo → Novo → Arquivo HTML** → nome `Admin` → cole `Admin.html` (sem a tag `<!DOCTYPE>` duplicada se o editor já criar HTML; o conteúdo completo funciona)

### 2. Rodar setup (antes do deploy)

No editor, selecione **`setupCms`** → **Executar** (autorize Drive/Script).

Funciona **mesmo sem publicar** o Web App. Se ainda não implantou, `publicContentUrl` virá `null` — isso é normal.

### 3. Publicar Web App

1. **Implantar → Nova implantação**
2. Tipo: **App da Web**
3. Executar como: **Eu**
4. Quem tem acesso: **Qualquer pessoa**
5. Copie a URL (ex.: `https://script.google.com/macros/s/XXXX/exec`)

Senha padrão (pode mudar em **Projeto → Configurações → Propriedades do script**):

- E-mail: `mitplay10@gmail.com`
- Senha: `mitgold`

Propriedades: `PM_ADMIN_EMAIL` e `PM_ADMIN_PASSWORD`.

### 4. Conectar a landing

Em `js/config.js`, preencha:

```js
gasContentUrl: 'https://script.google.com/macros/s/SEU_ID/exec?action=content'
```

Faça commit + push. O site passa a carregar o conteúdo do GAS antes do `content.json` estático.

### 5. Editar o site

Abra a **URL do Web App** (sem `?action=content`) → tela de login → edite o JSON → **Salvar e publicar**.

A landing atualiza na próxima visita (sem redeploy no GitHub).

## Importar conteúdo atual

No admin GAS, cole o JSON de `content.json` do repositório no editor e salve.

Ou rode `setupCms` uma vez e substitua o arquivo no Google Drive (`player-monetizado-content.json`).

## Limitações

- Upload de imagens pelo admin React **não** funciona no GAS (use URLs já hospedadas ou links do Drive públicos)
- O admin React em `/admin` no GitHub Pages continua sem login; use este admin GAS para produção
- `localhost:3000` continua válido para dev com o server Node

## URLs úteis

| URL | Uso |
|-----|-----|
| `.../exec` | Admin (login) |
| `.../exec?action=content` | JSON público |
| `.../exec?action=health` | Teste rápido |
