# Atualizar o Admin no Google Apps Script

Salvar o arquivo **não** atualiza o site. Você precisa colar o HTML **e** publicar uma **nova versão** da implantação.

## Passo a passo

### 1. Gerar o arquivo no PC

```bash
npm run build:gas-admin
```

Arquivo gerado: `gas/Admin.html` (~240 KB, ~86 linhas — normal).

### 2. Colar no GAS

1. Abra [script.google.com](https://script.google.com) → seu projeto
2. Abra o arquivo HTML chamado **`Admin`** (nome exato, sem `.html`)
3. **Ctrl+A** → apagar tudo
4. Abra `gas/Admin.html` no Cursor → **Ctrl+A** → **Ctrl+C**
5. Cole no editor do GAS → **Ctrl+S** (Salvar)

### 3. Conferir se colou certo

No editor do GAS, use **Ctrl+F** e busque:

| Buscar | Significa |
|--------|-----------|
| `PM-ADMIN-BUILD:` | Arquivo novo (deve aparecer na linha 2) |
| `admin-sidebar--hidden` | Sidebar mobile corrigida |
| `contactPhone` | Campo telefone nas configurações |

Se **não achar** `admin-sidebar--hidden`, o paste falhou ou colou arquivo errado.

**Não precisa** atualizar `AdminStyles.html` para o CMS React — só o `Admin` importa.

### 4. Publicar nova versão (obrigatório)

1. **Implantar** → **Gerenciar implantações**
2. No lápis ✏️ da implantação ativa → **Editar**
3. **Versão** → **Nova versão**
4. **Implantar**

Sem isso, a URL continua servindo a versão antiga.

### 5. Testar

1. Abra a URL do Web App em **aba anônima** (evita cache)
2. Faça login
3. No rodapé da sidebar deve aparecer **Build 2026-07-22** (data do build)
4. Hero **não** deve ter "Link do botão"
5. Topbar **não** deve ter "Visualizar site"

## Erros comuns

| Problema | Causa |
|----------|--------|
| UI igual à antiga | Salvou mas não fez **Nova versão** na implantação |
| Erro ao salvar no GAS | Arquivo incompleto — cole de novo o `Admin.html` inteiro |
| Sidebar / campos iguais | Cache do navegador — use aba anônima |
| Admin antigo (editor JSON) | Arquivo errado — use `Admin.html` do build, não `AdminStyles.html` |

## URL correta

- Admin: `https://script.google.com/macros/s/SEU_ID/exec`
- JSON do site: `.../exec?action=content`
