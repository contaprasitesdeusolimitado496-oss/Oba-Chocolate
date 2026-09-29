# Oba Chocolate

Site estático da Oba Chocolate com páginas de coleções e loja de encomendas.

## Publicação no GitHub

1. Crie um repositório no GitHub.
2. Envie o conteúdo deste pacote mantendo a estrutura de pastas.
3. Para hospedar gratuitamente, ative o GitHub Pages nas configurações do repositório e escolha a branch principal.

## Estrutura

- `index.html`: página inicial.
- `loja.html`: catálogo, carrinho e geração do pedido para WhatsApp.
- `classicos.html`, `fit-vegano.html`, `presentes.html`: páginas das coleções.
- `assets/css/styles.css`: estilos do site.
- `assets/js/script.js`: animações da página.
- `assets/js/loja.js`: produtos, preços, carrinho e mensagem do pedido.
- `assets/images/`: imagens utilizadas no site.

## Atualizar produtos e preços

Edite a lista `products` no começo de `assets/js/loja.js`. Produtos com `price: null` aparecem como “valor sob consulta”; valores numéricos entram no subtotal automaticamente.

## WhatsApp

O telefone de destino está em `assets/js/loja.js`, na montagem do link `whatsapp://send`. Altere-o se o número comercial da Oba Chocolate mudar.
