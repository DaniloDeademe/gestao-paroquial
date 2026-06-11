# Sistema de Catequese — versão HTML, CSS e JavaScript puro

Esta é a versão do sistema feita em **código simples**: HTML, CSS e JavaScript puro, **sem React, sem framework e sem etapa de "build"**. É só abrir e usar. Ideal para entender, editar e mostrar como o sistema funciona por dentro (inclusive no vídeo do projeto).

## Os arquivos

| Arquivo | O que faz |
|---|---|
| `index.html` | A página. Só a estrutura — carrega os 3 scripts abaixo. |
| `style.css` | Toda a aparência (cores da paróquia, layout mobile). |
| `regras.js` | **As regras de negócio** (os 75%, faltas justificadas, aprovação). É o mesmo que foi testado no Jest. |
| `dados.js` | Dados de exemplo e o salvamento no navegador (localStorage). |
| `app.js` | A interface: telas, navegação, formulários. |

Os 5 arquivos precisam ficar **na mesma pasta**.

## Como testar no computador

Dê **dois cliques** em `index.html`. Abre no navegador e funciona. Não precisa instalar nada.

> Observação: alguns navegadores bloqueiam o carregamento dos `.js` quando o arquivo é aberto direto do disco (`file://`). Se a tela ficar em branco, use um servidor local simples: abra a pasta no terminal e rode `python -m http.server`, depois acesse `http://localhost:8000`. No Netlify (abaixo) isso nunca acontece.

## Como publicar online de graça

1. Acesse **https://app.netlify.com/drop**
2. **Arraste a pasta inteira** (com os 5 arquivos) para a página.
3. Você recebe um link público na hora. Mande para o Pe. Adriano.

Funciona igual no Vercel, GitHub Pages ou Cloudflare Pages — sempre enviando a pasta completa.

## Usuários e senhas

| Perfil | Usuário | Senha |
|---|---|---|
| Pároco | `pe.adriano` | `paroquia` |
| Catequista | `maria` | `catequese` |
| Escritório | `secretaria` | `paroquia` |

Na tela de login há o atalho **"Acessos de demonstração"** que preenche os campos. Para criar novos logins: entre como Pároco ou Secretaria → aba **Mais → Usuários e acessos → Novo acesso**.

## As regras de negócio (arquivo `regras.js`)

Este é o coração do sistema, e ficou separado de propósito para ser fácil de mostrar:

- **Mínimo de 75%** de presença na catequese **e** 75% nas missas (avaliados separadamente).
- **Faltas justificadas** (com atestado) são **abonadas**: saem da conta, não prejudicam o aluno.
- O catequizando só é **Aprovado** se passar nos **dois** critérios. Falhar em um já reprova.
- A função `arredondar()` corrige o erro de ponto flutuante do JavaScript (o mesmo cuidado do projeto em Jest).

Essas regras são exatamente as que foram especificadas na Engenharia de Software e validadas com os testes automatizados em Jest — aqui elas estão escritas de forma direta, em JavaScript puro, dentro de `regras.js`.

## Sobre os dados

Como nas versões anteriores, os dados ficam guardados **no navegador de cada aparelho** (localStorage). Perfeito para demonstração. Para uso real com várias pessoas compartilhando os mesmos dados, o próximo passo é um servidor central — essa é a etapa seguinte do projeto.

Para recomeçar do zero: aba **Mais → "Restaurar dados de exemplo"**.
