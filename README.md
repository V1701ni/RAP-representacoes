# Orçamentos RAP

Aplicativo web para criar, enviar e acompanhar orçamentos de aço da **RAP Representações**, empresa de representação comercial de Curitiba e região metropolitana.

O representante monta o orçamento no celular ou no computador, gera um PDF com a identidade visual da empresa e envia pelo WhatsApp em poucos toques. Os orçamentos ficam salvos no aparelho, funcionam sem internet e sincronizam com a nuvem para aparecerem em todos os aparelhos do usuário.

> Projeto real, em uso no dia a dia da empresa. Desenvolvido por **Vinicius Lima Pereira**, estudante de Sistemas de Informação.

---

## O problema

Os orçamentos eram montados à mão e enviados por WhatsApp e e-mail, sem padrão visual, sem histórico organizado e sem forma de acompanhar quais estavam em aberto. O usuário principal é uma pessoa mais velha, então a solução precisava ser simples, com letras grandes e poucos passos.

## Funcionalidades

### Orçamentos
- Cadastro do cliente:
  - CNPJ ou CPF com máscara e conferência dos dígitos verificadores, incluindo o novo **CNPJ alfanumérico** (em vigor desde julho de 2026);
  - telefone com DDD;
  - cidade escolhida em uma lista com Curitiba e região metropolitana.
- Sugestão automática de clientes já atendidos. Ao escolher um, os dados dele são preenchidos.
- Lista de produtos por grupo (chapas, perfis, tubos, telhas, corte), com busca sem acentos e um grupo "usados recentemente".
- Em cada item:
  - especificação, quantidade, unidade e preço;
  - preço com até 4 casas decimais, porque aço é vendido por kg;
  - lembra o último preço usado para aquele produto;
  - sugere as medidas já usadas antes para aquele produto.
- Desconto por produto ou no pedido inteiro, em % ou R$. Todas as contas são arredondadas em centavos, para a soma das linhas bater com o total.
- Frete incluso (CIF), por conta do cliente (FOB) ou cobrado como taxa de entrega.
- Condições comerciais em listas prontas: pagamento, prazo, validade e fornecedor, com o CNPJ do fornecedor já cadastrado.
- Duplicar orçamento, criar revisão (`2026-014-R1`) e começar um novo orçamento para o mesmo cliente.

### PDF profissional
- Gerado no próprio navegador com **jsPDF**, com as fontes da marca embutidas.
- Cabeçalho com logo, quadro de dados do cliente, tabela de itens com paginação automática, condições comerciais, totais, peso total e campo opcional de aceite do cliente.
- Tela "Confira antes de gerar", para revisar tudo antes de enviar.
- Envio direto pelo WhatsApp pela Web Share API. No computador, o PDF é baixado.

### Organização
- Situação de cada orçamento: em aberto, fechado ou perdido, com o motivo da perda.
- Etiquetas de validade ("Vence amanhã", "Vencido") e botão **Cobrar retorno pelo WhatsApp**, que abre uma mensagem pronta.
- Resumo do mês (orçado, fechado, taxa de fechamento) e relatório dos últimos 12 meses, por origem do cliente e por motivo de perda.
- Busca, filtros por período e ordenação.
- Exportação para Excel em CSV, com separador `;` e acentos corretos.

### Segurança dos dados
- Lixeira com 30 dias para recuperar orçamentos excluídos.
- Cópia de segurança em arquivo, com lembrete periódico.
- Migrações de dados por versão: atualizar o app nunca apaga dados antigos.
- Sincronização com a nuvem (detalhes abaixo).

### Uso no celular
- App instalável (PWA): ícone próprio e abertura em tela cheia.
- Funciona sem internet, por um service worker com estratégia *network-first*.
- O botão voltar do celular fecha só a janela aberta.
- Campos que avançam com Enter e opção de texto maior.

---

## Tecnologias

| Parte | Tecnologia |
|---|---|
| Interface | HTML, CSS e JavaScript puro (sem framework) |
| PDF | jsPDF, com as fontes Barlow e IBM Plex Sans Condensed embutidas |
| Dados no aparelho | `localStorage`, com migrações versionadas |
| Nuvem | Firebase Authentication (e-mail e senha) e Cloud Firestore (cliente *lite*) |
| Empacotamento | esbuild, para incluir só as funções do Firebase usadas (cerca de 220 KB) |
| App instalável e offline | Web App Manifest e Service Worker |
| Testes | Playwright, com o emulador oficial do Firebase Authentication e uma nuvem simulada |
| Hospedagem | Render (site estático) |

O app inteiro é **um único arquivo HTML**. Fontes, logo, jsPDF e Firebase vão embutidos, então ele não depende de CDN e abre mesmo sem conexão.

---

## Como a sincronização funciona

O app foi feito para funcionar **primeiro no aparelho** (*offline-first*). A nuvem é uma camada de sincronização por cima.

1. **Tudo é salvo primeiro no aparelho.** Cada orçamento tem um campo `alterado`, com data e hora da última mudança.
2. **Busca incremental.** Cada documento na nuvem recebe um `serverTimestamp()` (`sinc`). O aparelho guarda o maior `sinc` que já leu e, na próxima sincronização, busca só o que mudou depois dele (`where('sinc', '>', marca)`). Isso economiza leituras e não depende do relógio de cada aparelho.
3. **Envio do que está pendente.** Cada orçamento guarda localmente qual versão já está na nuvem (`_sinc`). Quando `_sinc` é diferente de `alterado`, ele precisa subir. Se a internet cair, a alteração fica pendente e sobe na próxima tentativa, mesmo que o app seja fechado.
4. **Conflitos.** Vale a versão mais recente de cada orçamento (*last-write-wins*). Os dados gerais (configurações, produtos e preços) seguem a mesma regra, mas a numeração sempre fica com o maior valor.
5. **Numeração sem repetir.** Se dois aparelhos sem internet criam o mesmo número, o que ainda não foi enviado ao cliente recebe automaticamente o próximo número livre.
6. **Quando sincroniza.** Ao abrir o app, ao voltar para ele, ao reconectar e a cada minuto com o app aberto.

### Regras de segurança do Firestore

Cada usuário só lê e grava os próprios dados:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{uid}/{documento=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

Estrutura dos dados:

```
usuarios/{uid}/orcamentos/{id}      um documento por orçamento
usuarios/{uid}/dados/geral          configurações, produtos, preços e numeração
```

---

## Arquivos

```
index.html                      o app completo (interface, PDF, dados e sincronização)
orcamentos.webmanifest          nome, ícones e modo tela cheia do app instalado
sw-orcamentos.js                service worker (abre sem internet)
icone-orcamentos-*.png          ícones do app (180, 192, 512 e versão "maskable")
```

---

## Como usar ou publicar

1. Publique os arquivos em qualquer hospedagem estática, como Render, GitHub Pages ou Netlify. Eles precisam ficar na raiz do site.
2. Para usar a nuvem, crie um projeto no Firebase:
   1. ative o login por **e-mail e senha**;
   2. crie o **Firestore** e publique as regras acima;
   3. registre um app da Web e coloque o `firebaseConfig` no app.
3. Abra o site, toque em **Entrar** e use o e-mail e a senha criados no Firebase.
4. No celular, use **Adicionar à tela inicial** para instalar o app.

Sem o Firebase configurado, o app funciona normalmente, só que salvando apenas no aparelho.

---

## Testes

Os testes automatizados usam **Playwright**, com celular e computador simulados. Eles cobrem:

- a migração de dados de versões antigas sem perder nada, e o PDF gerado igual ao de antes;
- o fluxo completo de orçamento, com o voltar do Android em cada janela, a lixeira e a numeração;
- as contas em centavos e o preço com 4 casas;
- o PDF com 30 itens, e-mails longos e observações;
- a sincronização entre dois aparelhos, sem internet, com conflitos e com números repetidos;
- o login real do Firebase, testado no emulador oficial;
- as telas de 360 a 1366 px, sem rolagem lateral, e o app abrindo sem internet.

---

## Autor

**Vinicius Lima Pereira**: estudante de Sistemas de Informação na Universidade Positivo, em Curitiba (PR).
