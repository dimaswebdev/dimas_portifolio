# Portfólio Dimas — revisão técnica V2

Versão evolutiva do portfólio criado durante o programa Oracle ONE / Alura.

## Preservação do projeto

- `main`: projeto educacional original, preservado.
- `portfolio-v2`: versão modernizada permanente, preservada separadamente da original.
- `feature/portfolio-v2`: branch histórica de desenvolvimento usada durante a revisão.
- [Pull Request de revisão](https://github.com/dimaswebdev/dimas_portifolio/pull/1) (não mesclar sem aprovação).

## Execução local

É um site estático (HTML, CSS e JavaScript). Pode ser aberto por servidor estático:

```bash
python -m http.server 8000
```

Em seguida, visitar `http://localhost:8000`.

## Melhorias implementadas

- Caminhos relativos adequados à publicação em subdiretório.
- Refatoração do CSS, com estilos consolidados e breakpoints responsivos.
- Gráficos SVG animados e repetíveis ao retornar à área visível.
- Galeria ampliável, navegação por setas, fechamento por Escape e retorno do foco.
- Menu mobile acessível e navegação por âncoras.
- Atalho "Pular para o conteúdo", área principal semântica e foco visível.
- Metadados básicos de SEO e melhorias nas descrições das imagens.
- Carregamento sob demanda de imagens abaixo da primeira tela.
- Remoção de dependências JavaScript desnecessárias.
- Contatos funcionais em lugar do antigo formulário sem mecanismo de envio.

## Verificações estáticas realizadas

- Sintaxe do JavaScript: aprovada.
- Delimitadores de CSS: consistentes.
- IDs HTML: sem duplicações.
- Links de navegação interna: destinos existentes.
- Presença da lógica de repetição dos gráficos: confirmada.

## Validação ainda necessária

- Inspecionar visualmente todos os componentes em celular, tablet e desktop após refatoração.
- Testar a galeria e navegação por teclado em navegadores reais.
- Executar Lighthouse, auditoria WCAG e verificar contraste efetivo.
- Converter/comprimir arquivos de imagem pesados após revisão visual; os originais ainda estão no repositório.
- Conferir disponibilidade e adequação dos canais de contato.
- Revisar direitos e informações do currículo, fotografias e projetos.
- Avaliar substituição de Font Awesome por ícones locais, se necessário.

## Publicações

- Original (branch `main`): https://dimas-portifolio.vercel.app
- Modernizada (branch `portfolio-v2`): implantação de prévia da Vercel vinculada à branch permanente.

A versão educacional original continua intacta na branch `main`. Não mesclar `portfolio-v2` em `main`, pois as duas versões devem coexistir.
