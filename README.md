# DIMAS DESIGNER — Portfólio V3

Terceira versão autoral, inteiramente redesenhada, do portfólio desenvolvido durante o programa Oracle ONE / Alura.

## Organização do repositório

- `main` — portfólio original desenvolvido no curso; permanece intacto.
- `portfolio-v2` — versão modernizada em layout fullscreen; permanece intacta.
- `portfolio-v3` — versão editorial de estúdio criativo, independente das anteriores.

**Nunca mesclar a V3 na `main` para preservar as três versões.**

## Direção de arte

Novo sistema editorial com hero de tipografia marcante, mascote 3D original, efeitos gráficos leves, projetos organizados em grade assimétrica com filtros, habilidades em barras progressivas, linha do tempo e contato em destaque.

Identidade preservada: azul `#006494`, azul-claro `#419ae3`, ciano `#38d0dd`, azul médio `#598ae5`; logo, imagens, mascote, seis projetos, conteúdo biográfico, formação, habilidades e hobbies do portfólio anterior.

Referências conceituais consultadas: materiais de design editorial e portfólio do Awwwards, com foco em tipografia, personalidade e navegação; boas práticas de acessibilidade e movimento do web.dev. O resultado é uma composição própria, não uma cópia de template.
- https://assets.awwwards.com/assets/files/live-presentation.pdf
- https://web.dev/learn/design/accessibility/
- https://web.dev/articles/prefers-reduced-motion

## Tecnologia

- HTML semântico e CSS moderno (Grid, Flexbox, clamp, container responsivo, custom properties)
- JavaScript nativo: filtro dos seis projetos, lightbox com elemento `dialog`, teclado, navegação com estado ativo, menu mobile, IntersectionObserver e barras animadas
- Movimento reduzido respeitado com `prefers-reduced-motion`
- Fontes: Space Grotesk e DM Sans, com fallback
- Sem dependência de framework JS pesado; prioriza desempenho e manutenção

Arquivos exclusivos da V3: `assets/css/v3.css` e `assets/js/v3.js`.

## Publicação

Prévia automática vinculada à branch: https://dimas-portifolio-git-portfolio-v3-dimaswebdevs-projects.vercel.app

A publicação pode estar sujeita à proteção de acesso de prévias da Vercel.

## Testes de qualidade

O workflow `.github/workflows/portfolio-quality.yml` foi adaptado para `portfolio-v3`, com testes Playwright de visualização responsiva (320, 390, 1280 e 1440 px), menu, filtros, galeria, habilidades e auditoria Lighthouse.

```bash
npm install
npx playwright install chromium
npm run qa
```

Para Lighthouse, execute `node scripts/serve.mjs` em outro terminal e, depois, `npm run audit`.

**Status de validação:** HTML com seções equilibradas, links internos e IDs conferidos; sintaxe de JavaScript e chaves CSS verificadas. Publicação Vercel pronta. Testes de navegador e Lighthouse ainda precisam de execução e análise confirmadas antes de se alegar resultados numéricos.

## Aprimoramentos futuros

- Testar a V3 visualmente em vários navegadores e dispositivos físicos
- Comprimir imagens principais e gerar WebP/AVIF compatíveis sem perder qualidade
- Revisar descrições e links de cada projeto com estudos de caso reais
- Configurar domínio personalizado e indicadores de Core Web Vitals
