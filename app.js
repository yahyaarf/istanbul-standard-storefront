const products = [,
  { id: 'boss-white-polo', name: 'Boss White Polo', color: 'White', price: 699, tag: 'NEW DROP', group: 'new', image: 'assets/boss1.png', description: 'Premium Turkish polo with a clean fit and strong fabric.' },
  { id: 'boss-red-polo', name: 'Boss Red Polo', color: 'Red', price: 699, tag: 'NEW DROP', group: 'new', image: 'assets/boss2.png', description: 'Premium Turkish polo with a clean fit and strong fabric.' },
  { id: 'boss-black-polo', name: 'Boss Black Polo', color: 'Black', price: 699, tag: 'NEW DROP', group: 'new', image: 'assets/boss3.png', description: 'Premium Turkish polo with a clean fit and strong fabric.' },
  { id: 'laco-blue-polo', name: 'Lacoste Blue Polo', color: 'Blue', price: 699, tag: 'NEW DROP', group: 'new', image: 'assets/laco1.png', description: 'Premium Turkish polo with a clean fit and strong fabric.' },
  { id: 'laco-white-polo', name: 'Lacoste White Polo', color: 'White', price: 699, tag: 'NEW DROP', group: 'new', image: 'assets/laco2.png', description: 'Premium Turkish polo with a clean fit and strong fabric.' },
  { id: 'laco-navy-polo', name: 'Lacoste Navy Polo', color: 'Navy', price: 699, tag: 'NEW DROP', group: 'new', image: 'assets/laco3.png', description: 'Premium Turkish polo with a clean fit and strong fabric.' },
  { id: 'tommy-blue-polo', name: 'Tommy Blue Polo', color: 'Blue', price: 699, tag: 'NEW DROP', group: 'new', image: 'assets/tommy1.png', description: 'Premium Turkish polo with a clean fit and strong fabric.' },
  { id: 'tommy-red-polo', name: 'Tommy Red Polo', color: 'Red', price: 699, tag: 'NEW DROP', group: 'new', image: 'assets/tommy2.png', description: 'Premium Turkish polo with a clean fit and strong fabric.' },
  { id: 'tommy-green-polo', name: 'Tommy Green Polo', color: 'Green', price: 699, tag: 'NEW DROP', group: 'new', image: 'assets/tommy3.png', description: 'Premium Turkish polo with a clean fit and strong fabric.' },
  { id: 'boss4-polo', name: 'Boss Polo', color: 'Premium', price: 699, tag: 'NEW DROP', group: 'new', image: 'assets/boss4.png', description: 'Premium Turkish polo with a clean fit and strong fabric.' },
  { id: 'boss5-polo', name: 'Boss Polo', color: 'Premium', price: 699, tag: 'NEW DROP', group: 'new', image: 'assets/boss5.png', description: 'Premium Turkish polo with a clean fit and strong fabric.' },
  { id: 'boss6-polo', name: 'Boss Polo', color: 'Premium', price: 699, tag: 'NEW DROP', group: 'new', image: 'assets/boss6.png', description: 'Premium Turkish polo with a clean fit and strong fabric.' },
  { id: 'ralph-polo', name: 'Ralph Polo', color: 'Premium', price: 699, tag: 'NEW DROP', group: 'new', image: 'assets/ralph.png', description: 'Premium Turkish polo with a clean fit and strong fabric.' },
  { id: 'ralph2-polo', name: 'Ralph Polo', color: 'Premium', price: 699, tag: 'NEW DROP', group: 'new', image: 'assets/ralph2.png', description: 'Premium Turkish menswear with a clean fit and strong fabric.' },
  { id: 'ralph3-polo', name: 'Ralph Polo', color: 'Premium', price: 699, tag: 'NEW DROP', group: 'new', image: 'assets/ralph3.png', description: 'Premium Turkish menswear with a clean fit and strong fabric.' },
  { id: 'shirt1', name: 'Premium Shirt', color: 'Classic', price: 699, tag: 'NEW DROP', group: 'new', image: 'assets/shirt1.png', description: 'Premium Turkish menswear with a clean fit and strong fabric.' },
  { id: 'shirt2', name: 'Premium Shirt', color: 'Classic', price: 699, tag: 'NEW DROP', group: 'new', image: 'assets/shirt2.png', description: 'Premium Turkish menswear with a clean fit and strong fabric.' }
];

let selectedFilter = 'all';
let cart = JSON.parse(localStorage.getItem('istanbul-standard-cart') || '[]');
let quickViewProduct = null;
let quickViewSize = 'M';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const money = n => `${n.toLocaleString('en-US')} DH`;

function productCard(product) {
  return `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-media">
        <span class="product-label">${product.tag}</span>
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <button class="product-quick" data-quick-view="${product.id}">Quick view</button>
      </div>
      <div class="product-details">
        <div class="product-title-row">
          <div><h3 class="product-title">${product.name}</h3><p class="product-color">${product.color}</p></div>
          <span class="product-price">${money(product.price)}</span>
        </div>
        <div class="product-footer">
          <div class="size-pills" aria-label="Select a size">
            ${['S','M','L','XL'].map((s, i) => `<button class="size-pill ${i === 1 ? 'active' : ''}" data-size="${s}" aria-label="Select size ${s}">${s}</button>`).join('')}
          </div>
          <button class="add-product" data-add-product="${product.id}" aria-label="Add ${product.name} to bag">+</button>
        </div>
      </div>
    </article>`;
}

function renderProducts() {
  const visible = selectedFilter === 'all' ? products : products.filter(p => p.group === selectedFilter);
  $('[data-product-grid]').innerHTML = visible.map(productCard).join('');
  bindProductCardEvents();
}

function bindProductCardEvents() {
  $$('[data-product-grid] .size-pill').forEach(button => {
    button.addEventListener('click', () => {
      const pills = $$('.size-pill', button.closest('.size-pills'));
      pills.forEach(p => p.classList.remove('active'));
      button.classList.add('active');
    });
  });
  $$('[data-add-product]').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.product-card');
      const size = $('.size-pill.active', card)?.dataset.size || 'M';
      addToCart(button.dataset.addProduct, size);
    });
  });
  $$('[data-quick-view]').forEach(button => button.addEventListener('click', () => openQuickView(button.dataset.quickView)));
}

function addToCart(productId, size) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(item => item.id === productId && item.size === size);
  if (existing) existing.qty += 1;
  else cart.push({ id: productId, size, qty: 1 });
  persistCart();
  renderCart();
  showToast(`${product.name} / ${size} added to your bag`);
}

function persistCart() {
  localStorage.setItem('istanbul-standard-cart', JSON.stringify(cart));
}

function renderCart() {
  const itemsContainer = $('[data-cart-items]');
  const empty = $('[data-cart-empty]');
  const footer = $('[data-cart-footer]');
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);

  $('[data-cart-count]').textContent = count;
  $('[data-cart-total]').textContent = money(total);
  itemsContainer.innerHTML = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    return `
      <article class="cart-line">
        <img src="${product.image}" alt="${product.name}" />
        <div><h3>${product.name}</h3><p>${product.color} · Size ${item.size}</p><p>Qty ${item.qty}</p><button class="remove-line" data-remove-line="${product.id}" data-size="${item.size}">Remove</button></div>
        <strong>${money(product.price * item.qty)}</strong>
      </article>`;
  }).join('');

  empty.hidden = cart.length !== 0;
  footer.hidden = cart.length === 0;
  $$('[data-remove-line]').forEach(button => {
    button.addEventListener('click', () => {
      cart = cart.filter(item => !(item.id === button.dataset.removeLine && item.size === button.dataset.size));
      persistCart(); renderCart();
    });
  });
}

function openCart() {
  $('[data-cart-drawer]').classList.add('open');
  $('[data-overlay]').classList.add('open');
  $('[data-cart-drawer]').setAttribute('aria-hidden', 'false');
}
function closeCart() {
  $('[data-cart-drawer]').classList.remove('open');
  $('[data-overlay]').classList.remove('open');
  $('[data-cart-drawer]').setAttribute('aria-hidden', 'true');
}

function openQuickView(id) {
  quickViewProduct = products.find(p => p.id === id);
  quickViewSize = 'M';
  const modal = $('[data-product-modal]');
  $('[data-quick-view]').innerHTML = `
    <div class="quick-view-image"><img src="${quickViewProduct.image}" alt="${quickViewProduct.name}" /></div>
    <div class="quick-view-content">
      <p class="eyebrow">${quickViewProduct.tag}</p>
      <h2>${quickViewProduct.name}</h2>
      <p class="quick-price">${money(quickViewProduct.price)}</p>
      <p class="quick-desc">${quickViewProduct.description}</p>
      <p class="quick-size-label">CHOOSE YOUR SIZE</p>
      <div class="size-pills" data-quick-sizes>${['S','M','L','XL'].map(s => `<button class="size-pill ${s === 'M' ? 'active' : ''}" data-quick-size="${s}">${s}</button>`).join('')}</div>
      <button class="button button-light quick-add" data-quick-add>Add to bag <span>↗</span></button>
    </div>`;
  $$('[data-quick-size]').forEach(button => button.addEventListener('click', () => {
    quickViewSize = button.dataset.quickSize;
    $$('[data-quick-size]').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
  }));
  $('[data-quick-add]').addEventListener('click', () => {
    addToCart(quickViewProduct.id, quickViewSize);
    modal.close();
  });
  modal.showModal();
}

function showToast(message) {
  const toast = $('[data-toast]');
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(window.toastTimer);
  window.toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

function renderSearch(query = '') {
  const cleaned = query.trim().toLowerCase();
  const matches = products.filter(p => !cleaned || [p.name, p.color, p.tag].join(' ').toLowerCase().includes(cleaned));
  $('[data-search-results]').innerHTML = matches.map(p => `
    <button class="search-result" data-search-product="${p.id}">
      <img src="${p.image}" alt="" /><span><strong>${p.name}</strong><span>${money(p.price)}</span></span>
    </button>`).join('') || '<p style="color:#a7a7a2;font-size:12px">No piece found yet.</p>';
  $$('[data-search-product]').forEach(button => button.addEventListener('click', () => {
    $('[data-search-modal]').close(); openQuickView(button.dataset.searchProduct);
  }));
}

$$('.filter-tab').forEach(button => button.addEventListener('click', () => {
  selectedFilter = button.dataset.filter;
  $$('.filter-tab').forEach(b => b.classList.remove('active'));
  button.classList.add('active');
  renderProducts();
}));


$('[data-cart-trigger]').addEventListener('click', openCart);
$$('[data-cart-close]').forEach(button => button.addEventListener('click', closeCart));
$('[data-overlay]').addEventListener('click', closeCart);
$('[data-checkout]').addEventListener('click', () => showToast('Checkout is ready to connect to your payment provider.'));

$('[data-size-guide-trigger]').addEventListener('click', () => $('[data-size-modal]').showModal());
$('[data-size-close]').addEventListener('click', () => $('[data-size-modal]').close());

$('[data-search-trigger]').addEventListener('click', () => {
  renderSearch();
  $('[data-search-modal]').showModal();
  setTimeout(() => $('[data-search-input]').focus(), 60);
});
$('[data-search-close]').addEventListener('click', () => $('[data-search-modal]').close());
$('[data-search-input]').addEventListener('input', e => renderSearch(e.target.value));

$('[data-modal-close]').addEventListener('click', () => $('[data-product-modal]').close());

$('[data-newsletter-focus]').addEventListener('click', () => {
  $('#newsletter-email').focus();
  $('#newsletter-email').scrollIntoView({ behavior: 'smooth', block: 'center' });
});
$('[data-newsletter-form]').addEventListener('submit', event => {
  event.preventDefault();
  $('[data-newsletter-message]').textContent = 'You are on the list. The next drop will find you first.';
  event.currentTarget.reset();
});

const mobileToggle = $('[data-mobile-menu-toggle]');
mobileToggle.addEventListener('click', () => {
  mobileToggle.classList.toggle('open');
  $('[data-mobile-nav]').classList.toggle('open');
  mobileToggle.setAttribute('aria-expanded', mobileToggle.classList.contains('open'));
});
$$('[data-mobile-nav] a').forEach(link => link.addEventListener('click', () => {
  mobileToggle.classList.remove('open');
  $('[data-mobile-nav]').classList.remove('open');
  mobileToggle.setAttribute('aria-expanded', 'false');
}));

renderProducts();
renderCart();


