const products = [
  { id: 'palha-classica', category: 'classicos', name: 'Palha Italiana Clássica', detail: 'A assinatura Oba para presentear ou dividir.', price: null, image: 'oba-hero-artesanal.png' },
  { id: 'trufas-classicas', category: 'classicos', name: 'Trufas Artesanais', detail: 'Peças delicadas para montar sua caixa.', price: null, image: 'oba-bombons-presentes.png' },
  { id: 'palha-fit', category: 'fit', name: 'Palha Italiana Fit', detail: 'Opções sem leite e sem adição de açúcar.', price: 10, image: 'oba-palha-fit.png' },
  { id: 'trufa-fit', category: 'fit', name: 'Trufa Fit', detail: 'Cacau, café, limão e outros sabores do atelier.', price: 8, image: 'oba-produtos-artesanais.png' },
  { id: 'brigadeiro-fit', category: 'fit', name: 'Brigadeiro Fit', detail: 'Uma opção intensa e feita em pequenos lotes.', price: 10, image: 'oba-brigadeiro-fit.png' },
  { id: 'caixa-presente', category: 'presentes', name: 'Caixa Presente Personalizada', detail: 'Para aniversários, agradecimentos e celebrações.', price: null, image: 'oba-presentes-artesanais.png' },
  { id: 'corporativo', category: 'presentes', name: 'Presentes Corporativos', detail: 'Composições para equipes, clientes e parceiros.', price: null, image: 'oba-corporativo.png' }
];
const storageKey = 'oba-chocolate-cart';
let cart = JSON.parse(localStorage.getItem(storageKey) || '{}');
const grid = document.querySelector('#shop-grid');
const cartItems = document.querySelector('#cart-items');
const cartCount = document.querySelector('#cart-count');
const cartSummary = document.querySelector('#cart-summary');
const cartTotal = document.querySelector('#cart-total');
const cartNote = document.querySelector('#cart-note');
const whatsappOrder = document.querySelector('#whatsapp-order');
function saveCart() { localStorage.setItem(storageKey, JSON.stringify(cart)); }
function productById(id) { return products.find((product) => product.id === id); }
function money(value) { return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
function renderProducts(filter = 'all') {
  grid.innerHTML = products.filter((product) => filter === 'all' || product.category === filter).map((product) => `<article class="shop-product"><img src="${product.image}" alt="${product.name}"><div><p>${product.category === 'fit' ? 'Fit & Vegano' : product.category === 'presentes' ? 'Presentes' : 'Clássicos'}</p><h3>${product.name}</h3><span>${product.detail}</span><strong>${product.price ? `${money(product.price)} / un.` : 'Valor sob consulta'}</strong><div class="product-order"><button class="product-start" data-start="${product.id}">Escolher quantidade <b>+</b></button><div class="inline-quantity" data-picker="${product.id}" hidden><div><button aria-label="Diminuir quantidade de ${product.name}" data-change="${product.id}" data-value="-1">−</button><input type="number" min="1" value="1" inputmode="numeric" aria-label="Quantidade de ${product.name}" data-output="${product.id}"><button aria-label="Aumentar quantidade de ${product.name}" data-change="${product.id}" data-value="1">+</button></div><button class="confirm-inline" data-confirm="${product.id}">Adicionar ao pedido</button></div></div></div></article>`).join('');
  grid.querySelectorAll('[data-start]').forEach((button) => button.addEventListener('click', () => { const picker = grid.querySelector(`[data-picker="${button.dataset.start}"]`); picker.hidden = false; button.hidden = true; }));
  grid.querySelectorAll('[data-change]').forEach((button) => button.addEventListener('click', () => { const output = grid.querySelector(`[data-output="${button.dataset.change}"]`); output.value = Math.max(1, Number(output.value) + Number(button.dataset.value)); }));
  grid.querySelectorAll('[data-confirm]').forEach((button) => button.addEventListener('click', () => { const id = button.dataset.confirm; const field = grid.querySelector(`[data-output="${id}"]`); const quantity = Math.max(1, Number(field.value) || 1); field.value = quantity; cart[id] = (cart[id] || 0) + quantity; saveCart(); renderCart(); grid.querySelector(`[data-picker="${id}"]`).hidden = true; grid.querySelector(`[data-start="${id}"]`).hidden = false; }));
}
function renderCart() {
  const entries = Object.entries(cart).filter(([, quantity]) => quantity > 0);
  const total = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  cartCount.textContent = total;
  cartSummary.textContent = `${total} ${total === 1 ? 'item selecionado' : 'itens selecionados'}`;
  if (!entries.length) { cartItems.innerHTML = '<li class="empty-cart">Você ainda não adicionou itens.</li>'; cartTotal.textContent = 'Subtotal: R$ 0,00'; cartNote.textContent = ''; whatsappOrder.href = '#carrinho'; whatsappOrder.classList.add('is-disabled'); return; }
  const pricedTotal = entries.reduce((sum, [id, quantity]) => sum + ((productById(id).price || 0) * quantity), 0);
  const pendingCount = entries.filter(([id]) => !productById(id).price).length;
  cartItems.innerHTML = entries.map(([id, quantity]) => { const product = productById(id); const linePrice = product.price ? `${money(product.price)} × ${quantity} = ${money(product.price * quantity)}` : 'Valor a confirmar'; return `<li><div><strong>${product.name}</strong><span>${linePrice}</span></div><div class="quantity"><button aria-label="Diminuir ${product.name}" data-cart-change="${id}" data-value="-1">−</button><b>${quantity}</b><button aria-label="Aumentar ${product.name}" data-cart-change="${id}" data-value="1">+</button></div></li>`; }).join('');
  cartTotal.textContent = `Subtotal calculado: ${money(pricedTotal)}`;
  cartNote.textContent = pendingCount ? `${pendingCount} item(ns) com valor a confirmar.` : 'Valores de todos os itens selecionados calculados.';
  cartItems.querySelectorAll('[data-cart-change]').forEach((button) => button.addEventListener('click', () => { const id = button.dataset.cartChange; cart[id] += Number(button.dataset.value); if (cart[id] <= 0) delete cart[id]; saveCart(); renderCart(); }));
  const lines = entries.map(([id, quantity]) => { const product = productById(id); return `• ${product.name} — ${quantity} ${quantity === 1 ? 'unidade' : 'unidades'}${product.price ? ` — ${money(product.price * quantity)}` : ' — valor a confirmar'}`; }).join('\n');
  const message = `Olá! Gostaria de fazer uma encomenda na Oba Chocolate.\n\nItens selecionados:\n${lines}\n\nSubtotal calculado: ${money(pricedTotal)}${pendingCount ? '\nHá itens com valor a confirmar.' : ''}\n\nPoderiam confirmar a disponibilidade, o prazo e o valor final, por favor?`;
  whatsappOrder.href = `whatsapp://send?phone=5521999297818&text=${encodeURIComponent(message)}`;
  whatsappOrder.classList.remove('is-disabled');
}
document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('[data-filter]').forEach((item) => item.classList.remove('is-active')); button.classList.add('is-active'); renderProducts(button.dataset.filter); }));
renderProducts(); renderCart();
