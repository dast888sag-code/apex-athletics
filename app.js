/* ==========================================================================
   Apex Athletics JavaScript Logic
   ========================================================================== */

// --- 1. Product Data Catalog ---
const PRODUCTS = [
    {
        id: "apex-chrono",
        title: "Смарт-часы Apex Chrono",
        category: "wearables",
        categoryName: "Гаджеты",
        price: 24900,
        rating: 4.8,
        image: "assets/product_watch.jpg",
        desc: "Apex Chrono — это революционные спортивные часы в корпусе из прочного углеволокна. Измеряют пульс, уровень кислорода в крови, HRV (вариабельность ритма) и детально анализируют ваши тренировки с помощью ИИ-алгоритмов.",
        specs: [
            { name: "Материал корпуса", value: "Карбон / Авиационный титан" },
            { name: "Стекло", value: "Сапфировое с антибликом" },
            { name: "Время работы", value: "До 14 дней в спорт-режиме" },
            { name: "Водонепроницаемость", value: "10 ATM (до 100 метров)" },
            { name: "Сенсоры", value: "GPS, ГЛОНАСС, Пульсоксиметр, ЭКГ" }
        ],
        tag: "ХИТ"
    },
    {
        id: "neon-pulse",
        title: "Беговые кроссовки NeonPulse",
        category: "footwear",
        categoryName: "Обувь",
        price: 15400,
        rating: 4.9,
        image: "assets/product_shoes.jpg",
        desc: "Инновационная модель для бега по шоссе и пересеченной местности. Подошва со встроенной карбоновой пластиной возвращает до 85% энергии каждого шага, снижая нагрузку на суставы и увеличивая скорость бега.",
        specs: [
            { name: "Вес полупары", value: "195 г (размер 42)" },
            { name: "Амортизация", value: "Технология Apex Cushion Foam" },
            { name: "Материал верха", value: "Дышащий Engineered Mesh" },
            { name: "Перепад (дроп)", value: "8 мм" }
        ],
        tag: "NEW"
    },
    {
        id: "titan-dumbbells",
        title: "Гантели Titan Adjustable",
        category: "strength",
        categoryName: "Силовые",
        price: 36900,
        rating: 4.7,
        image: "assets/product_dumbbells.jpg",
        desc: "Регулируемые гантели Titan заменяют целый гантельный ряд в вашем домашнем спортзале. Интуитивный поворотный механизм позволяет мгновенно менять рабочий вес от 2 до 24 кг одной рукой.",
        specs: [
            { name: "Диапазон веса", value: "от 2 до 24 кг на гантель" },
            { name: "Количество шагов", value: "15 вариантов регулировки" },
            { name: "Материал дисков", value: "Высокопрочная сталь в полимере" },
            { name: "Комплектация", value: "2 регулируемые гантели + подставки" }
        ],
        tag: "НАБОР"
    },
    {
        id: "stealth-backpack",
        title: "Рюкзак Stealth Waterproof",
        category: "accessories",
        categoryName: "Аксессуары",
        price: 9800,
        rating: 4.6,
        image: "assets/product_backpack.jpg",
        desc: "Сверхпрочный водонепроницаемый рюкзак для тренировок и путешествий в стиле Techwear. Специальное изолированное отделение для влажной экипировки и обуви, отсек под ноутбук 16'' и флягу.",
        specs: [
            { name: "Объем", value: "35 литров" },
            { name: "Материал", value: "Cordura 1000D / TPU покрытие" },
            { name: "Фурнитура", value: "Влагозащитные молнии YKK" },
            { name: "Спинка", value: "Анатомическая вентилируемая 3D-mesh" }
        ],
        tag: "АКЦИЯ"
    }
];

// --- 2. Application State ---
let cart = [];
let activeCategory = "all";
let searchQuery = "";
let currentDetailProduct = null;

// --- 3. DOM Elements Cache ---
const elements = {
    productsGrid: document.getElementById('productsGrid'),
    categoryFilterTabs: document.getElementById('categoryFilterTabs'),
    searchInput: document.getElementById('searchInput'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    
    // Mobile navigation
    mobileNavToggleBtn: document.getElementById('mobileNavToggleBtn'),
    mobileMenuDropdown: document.getElementById('mobileMenuDropdown'),
    
    // Cart elements
    cartTriggerBtn: document.getElementById('cartTriggerBtn'),
    cartCloseBtn: document.getElementById('cartCloseBtn'),
    cartDrawer: document.getElementById('cartDrawer'),
    cartDrawerOverlay: document.getElementById('cartDrawerOverlay'),
    cartItemsList: document.getElementById('cartItemsList'),
    cartCountBadge: document.getElementById('cartCountBadge'),
    cartHeaderCount: document.getElementById('cartHeaderCount'),
    cartSubtotal: document.getElementById('cartSubtotal'),
    cartGrandTotal: document.getElementById('cartGrandTotal'),
    cartDrawerFooter: document.getElementById('cartDrawerFooter'),
    cartEmptyContinueShopping: document.getElementById('cartEmptyContinueShopping'),
    
    // Product details modal
    productModalOverlay: document.getElementById('productModalOverlay'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    modalContentBody: document.getElementById('modalContentBody'),
    
    // Checkout elements
    checkoutBtn: document.getElementById('checkoutBtn'),
    checkoutModalOverlay: document.getElementById('checkoutModalOverlay'),
    checkoutModalCloseBtn: document.getElementById('checkoutModalCloseBtn'),
    orderForm: document.getElementById('orderForm'),
    checkoutFormStep: document.getElementById('checkoutFormStep'),
    checkoutSuccessStep: document.getElementById('checkoutSuccessStep'),
    orderIdLabel: document.getElementById('orderIdLabel'),
    successTotalLabel: document.getElementById('successTotalLabel'),
    successCloseBtn: document.getElementById('successCloseBtn'),
    
    // Newsletter and Notification
    newsletterForm: document.getElementById('newsletterForm'),
    toastContainer: document.getElementById('toastContainer')
};

// --- 4. Initialization & Setup ---
document.addEventListener('DOMContentLoaded', () => {
    // Render initial products
    renderProducts();
    
    // Bind Event Listeners
    setupEventListeners();
    
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Load local storage values if they exist
    loadThemeSetting();
    updateCartUI();
});

// --- 5. Theme Settings ---
function loadThemeSetting() {
    const savedTheme = localStorage.getItem('apex-theme');
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
    }
}

function toggleTheme() {
    if (document.body.classList.contains('dark-theme')) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        localStorage.setItem('apex-theme', 'light');
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        localStorage.setItem('apex-theme', 'dark');
    }
}

// --- 6. Event Binding ---
function setupEventListeners() {
    // Theme Toggle
    elements.themeToggleBtn.addEventListener('click', toggleTheme);

    // Mobile Hamburger
    elements.mobileNavToggleBtn.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu on clicking links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            elements.mobileMenuDropdown.style.display = 'none';
            const openIcon = elements.mobileNavToggleBtn.querySelector('.menu-open-icon');
            const closeIcon = elements.mobileNavToggleBtn.querySelector('.menu-close-icon');
            openIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        });
    });

    // Catalog filtering
    elements.categoryFilterTabs.addEventListener('click', (e) => {
        const tab = e.target.closest('.filter-tab');
        if (!tab) return;
        
        // Update active class
        elements.categoryFilterTabs.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        activeCategory = tab.dataset.category;
        renderProducts();
    });

    // Searching catalog
    elements.searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderProducts();
    });

    // Cart Drawer Toggle
    elements.cartTriggerBtn.addEventListener('click', openCart);
    elements.cartCloseBtn.addEventListener('click', closeCart);
    elements.cartDrawerOverlay.addEventListener('click', closeCart);
    elements.cartEmptyContinueShopping.addEventListener('click', closeCart);

    // Product Detail Modal Closing
    elements.modalCloseBtn.addEventListener('click', closeProductModal);
    elements.productModalOverlay.addEventListener('click', (e) => {
        if (e.target === elements.productModalOverlay) closeProductModal();
    });

    // Add to Cart from dynamic lists (delegated)
    elements.productsGrid.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.add-to-cart-btn');
        if (addBtn) {
            e.stopPropagation();
            const productId = addBtn.dataset.id;
            addToCart(productId, 1);
            return;
        }

        const cardImg = e.target.closest('.product-img-wrapper');
        if (cardImg) {
            const productId = cardImg.dataset.id;
            openProductModal(productId);
        }
    });

    // Quantity change in detail modal
    elements.modalContentBody.addEventListener('click', (e) => {
        const qtyBtn = e.target.closest('.modal-qty-btn');
        if (qtyBtn) {
            const input = elements.modalContentBody.querySelector('#modalQtyVal');
            let val = parseInt(input.textContent);
            if (qtyBtn.classList.contains('qty-minus') && val > 1) {
                input.textContent = --val;
            } else if (qtyBtn.classList.contains('qty-plus') && val < 20) {
                input.textContent = ++val;
            }
        }
        
        const modalAddBtn = e.target.closest('.modal-add-to-cart');
        if (modalAddBtn) {
            const productId = modalAddBtn.dataset.id;
            const input = elements.modalContentBody.querySelector('#modalQtyVal');
            const qty = parseInt(input.textContent);
            addToCart(productId, qty);
            closeProductModal();
        }
    });

    // Cart drawer operations
    elements.cartItemsList.addEventListener('click', (e) => {
        const cartItem = e.target.closest('.cart-item');
        if (!cartItem) return;
        const itemId = cartItem.dataset.id;
        
        const qtyMinus = e.target.closest('.qty-minus');
        const qtyPlus = e.target.closest('.qty-plus');
        const removeBtn = e.target.closest('.cart-item-remove-btn');
        
        if (qtyMinus) {
            adjustCartQuantity(itemId, -1);
        } else if (qtyPlus) {
            adjustCartQuantity(itemId, 1);
        } else if (removeBtn) {
            removeFromCart(itemId);
        }
    });

    // Checkout Modal
    elements.checkoutBtn.addEventListener('click', openCheckout);
    elements.checkoutModalCloseBtn.addEventListener('click', closeCheckout);
    elements.checkoutModalOverlay.addEventListener('click', (e) => {
        if (e.target === elements.checkoutModalOverlay) closeCheckout();
    });
    
    // Order form submit
    elements.orderForm.addEventListener('submit', handleOrderSubmit);
    
    // Checkout Success Return button
    elements.successCloseBtn.addEventListener('click', () => {
        closeCheckout();
        closeCart();
    });
    
    // Newsletter Subscription
    elements.newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = elements.newsletterForm.querySelector('input');
        showToast(`Почта ${input.value} успешно подписана на новости!`, 'success');
        input.value = '';
    });
    
    // Scroll header styling
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            elements.themeToggleBtn.style.borderColor = 'transparent';
            elements.cartTriggerBtn.style.borderColor = 'transparent';
        } else {
            elements.themeToggleBtn.style.borderColor = 'var(--color-border)';
            elements.cartTriggerBtn.style.borderColor = 'var(--color-border)';
        }
    });
}

// --- 7. Mobile Menu ---
function toggleMobileMenu() {
    const isHidden = elements.mobileMenuDropdown.style.display === 'none' || !elements.mobileMenuDropdown.style.display;
    const openIcon = elements.mobileNavToggleBtn.querySelector('.menu-open-icon');
    const closeIcon = elements.mobileNavToggleBtn.querySelector('.menu-close-icon');

    if (isHidden) {
        elements.mobileMenuDropdown.style.display = 'flex';
        openIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
    } else {
        elements.mobileMenuDropdown.style.display = 'none';
        openIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    }
}

// --- 8. Product Catalog Rendering ---
function renderProducts() {
    elements.productsGrid.innerHTML = '';
    
    const filtered = PRODUCTS.filter(prod => {
        const matchesCategory = (activeCategory === "all" || prod.category === activeCategory);
        const matchesSearch = prod.title.toLowerCase().includes(searchQuery) || 
                              prod.desc.toLowerCase().includes(searchQuery) ||
                              prod.categoryName.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        elements.productsGrid.innerHTML = `
            <div class="empty-catalog-state">
                <i data-lucide="search-code" class="empty-icon"></i>
                <p>Товары не найдены. Попробуйте изменить параметры поиска или фильтров.</p>
            </div>
        `;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img-wrapper" data-id="${product.id}">
                ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ''}
                <img src="${product.image}" alt="${product.title}" class="product-img" loading="lazy">
            </div>
            <div class="product-info">
                <div class="product-meta">
                    <span class="product-category">${product.categoryName}</span>
                    <span class="product-rating">
                        <i data-lucide="star"></i> ${product.rating}
                    </span>
                </div>
                <h3 class="product-title">${product.title}</h3>
                <p class="product-desc">${product.desc.substring(0, 85)}...</p>
                <div class="product-footer">
                    <span class="product-price">${product.price.toLocaleString('ru-RU')} ₽</span>
                    <button class="add-to-cart-btn" data-id="${product.id}" aria-label="Добавить в корзину">
                        <i data-lucide="shopping-cart"></i>
                    </button>
                </div>
            </div>
        `;
        elements.productsGrid.appendChild(card);
    });

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// --- 9. Modal Window: Product Detail ---
function openProductModal(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    currentDetailProduct = product;
    
    elements.modalContentBody.innerHTML = `
        <div class="modal-img-column">
            <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="modal-details-column">
            <span class="modal-category">${product.categoryName}</span>
            <h2 class="modal-title">${product.title}</h2>
            <div class="modal-rating-price">
                <span class="product-rating"><i data-lucide="star"></i> ${product.rating}</span>
                <span class="modal-price">${product.price.toLocaleString('ru-RU')} ₽</span>
            </div>
            
            <p class="modal-desc">${product.desc}</p>
            
            <div class="modal-specs">
                <h4>Характеристики:</h4>
                <div class="spec-list">
                    ${product.specs.map(spec => `
                        <div class="spec-item">
                            <span class="spec-name">${spec.name}</span>
                            <span class="spec-value">${spec.value}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="modal-actions">
                <div class="modal-qty">
                    <button class="qty-btn modal-qty-btn qty-minus"><i data-lucide="minus"></i></button>
                    <span class="qty-val" id="modalQtyVal">1</span>
                    <button class="qty-btn modal-qty-btn qty-plus"><i data-lucide="plus"></i></button>
                </div>
                <button class="btn btn-primary modal-add-to-cart" data-id="${product.id}">
                    <i data-lucide="shopping-cart"></i> Добавить в корзину
                </button>
            </div>
        </div>
    `;

    elements.productModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // block page scroll

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function closeProductModal() {
    elements.productModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    currentDetailProduct = null;
}

// --- 10. Shopping Cart Logic ---
function openCart() {
    elements.cartDrawer.classList.add('active');
    elements.cartDrawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    elements.cartDrawer.classList.remove('active');
    elements.cartDrawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function addToCart(productId, qty) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.product.id === productId);
    if (existing) {
        existing.quantity += qty;
    } else {
        cart.push({ product, quantity: qty });
    }

    updateCartUI();
    showToast(`Товар "${product.title}" добавлен в корзину (${qty} шт.)`, 'success');
    
    // Animate cart badge
    elements.cartCountBadge.classList.add('shake-animate');
    setTimeout(() => {
        elements.cartCountBadge.classList.remove('shake-animate');
    }, 400);
}

function adjustCartQuantity(productId, delta) {
    const item = cart.find(item => item.product.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartUI();
    }
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.product.id === productId);
    if (index === -1) return;
    
    const title = cart[index].product.title;
    cart.splice(index, 1);
    updateCartUI();
    showToast(`Товар "${title}" удален из корзины`, 'info');
}

function updateCartUI() {
    const totalCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
    const subtotal = cart.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);
    
    // Badges update
    elements.cartCountBadge.textContent = totalCount;
    elements.cartHeaderCount.textContent = totalCount;

    // Cart list update
    if (cart.length === 0) {
        elements.cartItemsList.innerHTML = `
            <div class="cart-empty-state">
                <i data-lucide="shopping-bag" class="empty-cart-icon"></i>
                <p>Ваша корзина пуста</p>
                <button class="btn btn-secondary" id="cartEmptyContinueShopping">Перейти к покупкам</button>
            </div>
        `;
        // Re-bind click events for empty state button
        const continueShoppingBtn = elements.cartItemsList.querySelector('#cartEmptyContinueShopping');
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', closeCart);
        }
        elements.cartDrawerFooter.classList.add('hidden');
    } else {
        elements.cartDrawerFooter.classList.remove('hidden');
        elements.cartItemsList.innerHTML = '';
        
        cart.forEach(item => {
            const cartItemEl = document.createElement('div');
            cartItemEl.className = 'cart-item';
            cartItemEl.dataset.id = item.product.id;
            cartItemEl.innerHTML = `
                <img src="${item.product.image}" alt="${item.product.title}" class="cart-item-img">
                <div class="cart-item-details">
                    <span class="cart-item-title">${item.product.title}</span>
                    <span class="cart-item-price">${(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                    
                    <div class="cart-item-actions">
                        <div class="qty-selector">
                            <button class="qty-btn qty-minus"><i data-lucide="minus"></i></button>
                            <span class="qty-val">${item.quantity}</span>
                            <button class="qty-btn qty-plus"><i data-lucide="plus"></i></button>
                        </div>
                        <button class="cart-item-remove-btn" aria-label="Удалить">
                            <i data-lucide="trash-2"></i> Удалить
                        </button>
                    </div>
                </div>
            `;
            elements.cartItemsList.appendChild(cartItemEl);
        });
    }

    // Totals calculations
    elements.cartSubtotal.textContent = `${subtotal.toLocaleString('ru-RU')} ₽`;
    elements.cartGrandTotal.textContent = `${subtotal.toLocaleString('ru-RU')} ₽`;

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// --- 11. Checkout System ---
function openCheckout() {
    if (cart.length === 0) {
        showToast("Корзина пуста. Нечего оформлять!", "info");
        return;
    }
    
    // Reset forms
    elements.orderForm.reset();
    elements.checkoutFormStep.classList.remove('hidden');
    elements.checkoutSuccessStep.classList.add('hidden');
    
    elements.checkoutModalOverlay.classList.add('active');
    
    // Setup payment option cards triggers
    const paymentCards = elements.checkoutFormStep.querySelectorAll('.payment-option-card');
    paymentCards.forEach(card => {
        card.addEventListener('click', () => {
            paymentCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            card.querySelector('input').checked = true;
        });
    });
}

function closeCheckout() {
    elements.checkoutModalOverlay.classList.remove('active');
}

function handleOrderSubmit(e) {
    e.preventDefault();
    
    const subtotal = cart.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);
    
    // Generate order ID
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    elements.orderIdLabel.textContent = `#APX-${orderNum}`;
    elements.successTotalLabel.textContent = `${subtotal.toLocaleString('ru-RU')} ₽`;
    
    // Toggle modal views
    elements.checkoutFormStep.classList.add('hidden');
    elements.checkoutSuccessStep.classList.remove('hidden');
    
    // Empty Cart
    cart = [];
    updateCartUI();
    showToast("Заказ успешно оформлен!", "success");
}

// --- 12. Toast Notifications ---
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconName = type === 'success' ? 'check-circle' : 'info';
    
    toast.innerHTML = `
        <i data-lucide="${iconName}" class="toast-icon"></i>
        <span class="toast-message">${message}</span>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove toast after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3500);
}
