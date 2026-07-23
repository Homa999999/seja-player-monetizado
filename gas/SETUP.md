# Configurar GAS — passo a passo

## 1. Criar projeto no Google Apps Script

1. Abra [script.google.com](https://script.google.com) → **Novo projeto**
2. Renomeie o arquivo `Código.gs` e cole todo o conteúdo de `gas/Code.gs` deste repositório
3. **Arquivo → Novo → Arquivo HTML** → nome exato: `Admin`
4. Cole todo o conteúdo de `gas/Admin.html`
5. **Arquivo → Novo → Arquivo HTML** → nome exato: `AdminStyles`
6. Cole todo o conteúdo de `gas/AdminStyles.html` (ou rode `npm run sync:gas`)

## 2. Rodar setup (uma vez)

1. No editor GAS, selecione a função **`setupCms`**
2. Clique **Executar** e autorize Drive + Script
3. Isso cria o arquivo `player-monetizado-content.json` no Drive com o conteúdo completo do site

## 3. Publicar Web App

1. **Implantar → Nova implantação**
2. Tipo: **App da Web**
3. Executar como: **Eu**
4. Quem tem acesso: **Qualquer pessoa**
5. **Implantar** e copie a URL base, exemplo:
   ```
   https://script.google.com/macros/s/AKfycbxxxxxxxx/exec
   ```

## 4. Conectar ao site (GitHub Pages)

Abra **`js/config.js`** e substitua `COLE_SUA_URL_AQUI` pela URL do passo 3:

```js
gasContentUrl: 'https://script.google.com/macros/s/AKfycbxxxxxxxx/exec?action=content'
```

Depois rode no terminal:

```bash
npm run build:assets
```

Faça commit + push (deploy automático no GitHub Pages).

## 5. Editar conteúdo do site

1. Abra a URL do Web App **sem** `?action=content` (só `/exec`)
2. Login padrão:
   - E-mail: `mitplay10@gmail.com`
   - Senha: `mitgold`
3. Edite o JSON → **Salvar e publicar**
4. O site atualiza na próxima visita (sem redeploy)

## URLs úteis

| URL | Para quê |
|-----|----------|
| `.../exec` | Admin (login) |
| `.../exec?action=content` | JSON público (cole no config.js) |
| `.../exec?action=health` | Teste rápido |

## Sincronizar conteúdo do repositório → GAS

Se você editou `content.json` no repo e quer atualizar o seed do GAS:

```bash
npm run sync:gas
```

Copie o `Code.gs` atualizado para o projeto GAS e, no admin, cole o JSON ou rode `setupCms` de novo (projeto novo).

## Senha do admin

Em **Configurações do projeto → Propriedades do script**:

- `PM_ADMIN_EMAIL`
- `PM_ADMIN_PASSWORD`
