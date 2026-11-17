# DIMAS DESIGNER — Portfólio V3

Terceira versão autoral, inteiramente redesenhada, do portfólio desenvolvido durante o programa Oracle ONE / Alura.

## Organização do repositório

- `main` — portfólio original desenvolvido no curso; permanece intacto.
- `portfolio-v2` — versão modernizada em layout fullscreen; permanece intacta.
- `portfolio-v3` — versão editorial de estúdio criativo, independente das anteriores.

**Nunca mesclar a V3 na `main` para preservar as três versões.**

## Direção de arte

A V3 conserva sua arquitetura editorial e seus recursos interativos, mas recupera a atmosfera cromática luminosa da V2: azul e branco predominantes, gradiente azul/ciano suave, foto pessoal integrada sem moldura, grid de baixa opacidade e botões retangulares. O mascote 3D continua protagonista do hero; projetos permanecem em grade assimétrica filtrável, habilidades em barras progressivas, linha do tempo e contato em destaque.

Identidade preservada: azul `#006494`, azul-claro `#419ae3`, ciano `#38d0dd`, azul médio `#598ae5`; logo, imagens, mascote, seis projetos, conteúdo biográfico, formação, habilidades e hobbies do portfólio anterior.

**Referências de pesquisa visual (não copiadas):**
- Behance — portfólios minimalistas, hierarquia e estudos de caso: https://www.behance.net/gallery/241440231/Personal-Portfolio-Website-UIUX-Design
- Behance — paletas claras com azul: https://www.behance.net/gallery/240702661/Personal-Portfolio-Landing-Page-UI-Template
- Dribbble — tipografia editorial, fundos claros e composição: https://dribbble.com/shots/26977269-Bold-Typography-Portfolio-Website-Design
- Pesquisa de referências: https://www.awwwards.com/websites/portfolio/
- Acessibilidade e animações: https://web.dev/articles/prefers-reduced-motion

**Tipografia escolhida:** Manrope (títulos) e Inter (textos), com fallback sem dependência de JavaScript.

**Fundamentos preservados da V2:** #006494, #419AE3, #38D0DD, #598AE5 e branco. Tons pastel derivados desses azuis são usados nos grandes fundos para oferecer contraste entre texto e superfície, enquanto as cores originais continuam nos elementos da marca.

## Tecnologia

- HTML semântico e CSS moderno (Grid, Flexbox, clamp, container responsivo, custom properties)
- JavaScript nativo: filtro dos seis projetos, lightbox com elemento `dialog`, teclado, navegação com estado ativo, menu mobile, IntersectionObserver e barras animadas
- Movimento reduzido respeitado com `prefers-reduced-motion`
- Fontes: Manrope e Inter, com fallback
- Sem dependência de framework JS pesado; prioriza desempenho e manutenção

Arquivos exclusivos da V3: `assets/css/v3.css` e `assets/js/v3.js`.

## Publicação

Prévia automática vinculada à branch: https://dimas-portifolio-git-portfolio-v3-dimaswebdevs-projects.vercel.app

A publicação pode estar sujeita à proteção de acesso de prévias da Vercel.

## Testes de qualidade

O workflow `.github/workflows/portfolio-quality.yml` foi adaptado para `portfolio-v3`, com testes Playwright de visualização responsiva (320×700, 390×844, 768×1024, 1280×720, 1440×900 e 1920×1080), menu, filtros, galeria, habilidades e auditoria Lighthouse. A execução configura capturas integrais de cada tamanho como artefatos em `artifacts/screenshots/`.

```bash
npm install
npx playwright install chromium
npm run qa
```

Para Lighthouse, execute `node scripts/serve.mjs` em outro terminal e, depois, `npm run audit`.

**Status de validação:** verificar sintaxe CSS e JS, estruturas HTML, links internos e publicação Vercel após a mudança da direção visual. Os testes de navegador e Lighthouse estão configurados, mas sua execução completa ainda precisa de confirmação; não há notas de desempenho atribuídas.

## Aprimoramentos futuros

- Testar a V3 visualmente em vários navegadores e dispositivos físicos
- Comprimir imagens principais e gerar WebP/AVIF compatíveis sem perder qualidade
- Revisar descrições e links de cada projeto com estudos de caso reais
- Configurar domínio personalizado e indicadores de Core Web Vitals

## Mascote atualizado — recorte transparente

A nova composição do mascote foi preparada a partir da imagem original enviada pelo autor, em versões PNG com alfa (2048×2048) e WebP com transparência (2048×2048, cerca de 485 KB). O arquivo binário ainda precisa ser enviado ao GitHub para estar disponível no site.

Procedimento de publicação (somente em `portfolio-v3`):

1. Enviar `dimas_mascote_v3.webp` para `assets/img/dimas_mascote_v3.webp`.
2. Em `index.html`, na imagem `class="mascot"` da seção `#inicio`, substituir `./assets/img/dimas-3d.png` por `./assets/img/dimas_mascote_v3.webp`.
3. Substituir também o `href` do `preload` da imagem e, se apropriado, a imagem Open Graph.
4. Manter a máscara suave inferior existente em `assets/css/v3.css`; conferir contraste com o gradiente e executar testes responsivos.
5. Confirmar que a Vercel criou um deployment `READY`.

**Importante:** não apontar o HTML para o novo caminho antes de enviar o arquivo binário, para evitar imagem quebrada. As outras branches não devem ser modificadas.
