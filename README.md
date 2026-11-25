
# RAP Representações: site institucional

Site da **RAP Representações**, empresa de representação comercial de aço que atende Curitiba e região metropolitana.

O objetivo do site é transformar quem chega pelo Google em um pedido de orçamento pelo WhatsApp. Por isso ele é direto: mostra o que a empresa vende, quais fábricas representa, onde atende e como funciona o pedido, sempre com um botão de contato por perto.

🔗 **No ar:** https://rap-representacoes.onrender.com

> Projeto real, em uso pela empresa e ligado a campanhas de Google Ads. Desenvolvido por **Vinicius Lima Pereira**, estudante de Sistemas de Informação.

---

## Seções do site

- **Topo:** logo da marca e menu fixo, com atalho para o WhatsApp.
- **Abertura:** a chamada principal, o botão "Cotar agora no WhatsApp" e um quadro de orçamento sem compromisso.
- **Faixa de destaque:** 25 anos de experiência e a área de atendimento.
- **Empresas representadas:** Steelcorte, Troguer, Kitofer, Sanfer Aço e Itajé.
- **Produtos:**
  - chapas e bobinas;
  - perfis estruturais dobrados;
  - tubos;
  - telhas, incluindo as cumeeiras;
  - corte a laser, plasma e oxicorte.

  Cada grupo tem um botão que abre o WhatsApp com a mensagem já escrita.
- **Sobre o representante:** apresentação e diferenciais.
- **Obras e entregas:** fotos de materiais entregues.
- **Segmentos atendidos:** construção civil, indústria, serralherias e agronegócio.
- **Área de atendimento:** mapa ilustrado de Curitiba e das cidades da região metropolitana.
- **Como funciona:** o caminho do orçamento até a entrega, em 4 passos.
- **Perguntas frequentes** e **contato**.
- **Política de privacidade**, porque o site usa a medição do Google Ads.
- **Botão flutuante do WhatsApp** em todas as telas.

## Destaques técnicos

- **Arquivo único:** o site inteiro fica em um `index.html`, com estilos, imagens (WebP) e ícones embutidos. Um script de build junta tudo isso e gera o arquivo final.
- **Responsivo:** pensado primeiro para o celular. Foi testado em telas de 360 a 1440 px, sem rolagem lateral.
- **Conversões do Google Ads:** o clique no WhatsApp é registrado como conversão (tag `gtag`), para medir se a campanha está trazendo contatos de verdade.
- **SEO e compartilhamento:** título e descrição para o Google, e tags Open Graph para quando o link é enviado no WhatsApp.
- **Identidade visual:** logo redesenhado com efeito metálico, degradê azul da marca e verde reservado só para o WhatsApp.
- **Hospedagem:** site estático no Render, publicado automaticamente a cada commit.

## Tecnologias

HTML, CSS e JavaScript puro, sem framework. Script de build em Python e testes visuais com Playwright, em telas de celular e de computador. Hospedagem no Render e medição com Google Ads.

## Projeto relacionado

- **Orçamentos RAP:** app web que a empresa usa para montar os orçamentos, gerar o PDF e enviar pelo WhatsApp. Ele funciona no celular e no computador, com sincronização pela nuvem (Firebase). Fica em um repositório próprio.

---

## Autor

**Vinicius Lima Pereira**: estudante de Sistemas de Informação na Universidade Positivo, em Curitiba (PR).
