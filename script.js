 // TechStore Product Data
const products = [
    { id: 1, name: 'Wireless Headphones', price: 79.99, emoji: '🎧' },
    { id: 2, name: 'USB-C Cable', price: 19.99, emoji: '🔌' },
    { id: 3, name: 'Phone Stand', price: 24.99, emoji: '📱' },
    { id: 4, name: 'Screen Protector', price: 14.99, emoji: '📺' },
    { id: 5, name: 'Power Bank', price: 49.99, emoji: '🔋' },
    { id: 6, name: 'Webcam HD', price: 89.99, emoji: '📹' },
    { id: 7, name: 'Keyboard RGB', price: 129.99, emoji: '⌨️' },
    { id: 8, name: 'Mouse Wireless', price: 39.99, emoji: '🖱️' }
];

// Initialize cart from sessionStorage
let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

// Update cart display
function updateCart() {
    // Update cart count
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }

    // Update cart items display if on products page
    const cartItemsDiv = document.getElementById('cart-items');
    if (cartItemsDiv) {
        cartItemsDiv.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p>Your cart is empty</p>';
        } else {
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-qty">Qty: ${item.qty}</div>
                    </div>
                    <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
                `;
                cartItemsDiv.appendChild(cartItem);
            });
        }
    }

    // Update total
    const cartTotal = document.getElementById('cart-total');
    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        cartTotal.textContent = total.toFixed(2);
    }

    // Persist cart to sessionStorage
    sessionStorage.setItem('cart', JSON.stringify(cart));

    // Log tracking data
    logTrackingData('cart_updated', { items: cart.length, total: getCartTotal() });
}

// Get cart total
function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateCart();
    logTrackingData('product_added', { product_id: productId, product_name: product.name, price: product.price });
}

// Render products
function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>Premium quality ${product.name.toLowerCase()}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="btn-add-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Contact form handling
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        logTrackingData('contact_submitted', { name, email, message_length: message.length });

        const msgDiv = document.getElementById('form-message');
        msgDiv.textContent = '✓ Message sent successfully! Thank you for contacting us.';
        msgDiv.className = 'form-message success';
        
        form.reset();
        
        setTimeout(() => {
            msgDiv.style.display = 'none';
        }, 5000);
    });
}

// Cross-domain tracking
function logTrackingData(event, data = {}) {
    const trackingData = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        domain: window.location.hostname,
        event: event,
        data: data,
        sessionId: getSessionId()
    };

    console.log('📊 Tracking Event:', trackingData);

    // Store in sessionStorage for cross-domain testing
    const allEvents = JSON.parse(sessionStorage.getItem('trackingEvents')) || [];
    allEvents.push(trackingData);
    sessionStorage.setItem('trackingEvents', JSON.stringify(allEvents));
}

// Get or create session ID
function getSessionId() {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
}

// Page load handler
document.addEventListener('DOMContentLoaded', function() {
    // Log page view
    logTrackingData('page_view', { page: document.title });

    // Initialize components
    updateCart();
    renderProducts();
    initContactForm();

    // Log cross-domain navigation
    document.querySelectorAll('a.cross-domain').forEach(link => {
        link.addEventListener('click', function() {
            logTrackingData('cross_domain_navigation', { 
                target_url: this.href,
                from_domain: window.location.hostname
            });
        });
    });
});
