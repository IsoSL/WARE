// Products Data
const products = [
    {
        id: 1,
        title: "GamingBoost Pro",
        category: "software",
        price: 59.99,
        status: "in-stock",
        image: "/api/placeholder/300/200",
        description: "Advanced FPS booster and system optimizer"
    },
    {
        id: 2,
        title: "Pro Gaming Mouse",
        category: "hardware",
        price: 89.99,
        status: "in-stock",
        image: "/api/placeholder/300/200",
        description: "High-precision gaming mouse with customizable buttons"
    },
    {
        id: 3,
        title: "Mechanical Gaming Keyboard",
        category: "hardware",
        price: 129.99,
        status: "low-stock",
        image: "/api/placeholder/300/200",
        description: "Mechanical RGB keyboard with programmable keys"
    },
    {
        id: 4,
        title: "Cloud Gaming Subscription",
        category: "software",
        price: 14.99,
        status: "in-stock",
        image: "/api/placeholder/300/200",
        description: "Monthly subscription for cloud gaming service"
    },
    {
        id: 5,
        title: "Premium Gaming Headset",
        category: "accessories",
        price: 99.99,
        status: "in-stock",
        image: "/api/placeholder/300/200",
        description: "Surround sound gaming headset with noise cancellation"
    },
    {
        id: 6,
        title: "RGB Gaming Mouse Pad",
        category: "accessories",
        price: 39.99,
        status: "out-of-stock",
        image: "/api/placeholder/300/200",
        description: "Extra large RGB mouse pad with custom lighting"
    },
    {
        id: 7,
        title: "FPS Optimizer",
        category: "software",
        price: 29.99,
        status: "in-stock",
        image: "/api/placeholder/300/200",
        description: "Software to boost FPS in competitive games"
    },
    {
        id: 8,
        title: "Gaming Controller",
        category: "hardware",
        price: 69.99,
        status: "in-stock",
        image: "/api/placeholder/300/200",
        description: "Precision controller for PC and console gaming"
    }
];

// DOM Elements
const productGrid = document.querySelector('.product-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const themeToggle = document.getElementById('themeToggle');
const loginBtn = document.getElementById('loginBtn');
const cartBtn = document.getElementById('cartBtn');
const menuIcon = document.getElementById('menuIcon');
const navLinks = document.getElementById('navLinks');
const loginModal = document.getElementById('loginModal');
const cartModal = document.getElementById('cartModal');
const closeModals = document.querySelectorAll('.close-modal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const continueShoppingBtn = document.getElementById('continueShoppingBtn');
const toast = document.getElementById('toast');
const cartCount = document.querySelector('.cart-count');

// Cart Array
let cart = [];

// Initialize the application
function init() {
    loadTheme();
    renderProducts('all');
    setupEventListeners();
}

// Load theme from localStorage
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Toggle theme between light and dark mode
function toggleTheme() {
    if (document.body.classList.contains('dark-mode')) {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Render products based on category filter
function renderProducts(category) {
    productGrid.innerHTML = '';
    
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        let statusClass = '';
        switch(product.status) {
            case 'in-stock':
                statusClass = 'status-in-stock';
                break;
            case 'low-stock':
                statusClass = 'status-low-stock';
                break;
            case 'out-of-stock':
                statusClass = 'status-out-of-stock';
                break;
        }
        
        productCard.innerHTML = `
            <div class="product-image">
                <span class="product-status ${statusClass}">${formatStatus(product.status)}</span>
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-details">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.title}</h3>
                <p>${product.description}</p>
                <div class="product-price">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart" data-id="${product.id}" ${product.status === 'out-of-stock' ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        if (button.hasAttribute('disabled')) {
            button.style.backgroundColor = '#ccc';
            button.style.cursor = 'not-allowed';
        } else {
            button.addEventListener('click', addToCart);
        }
    });
}

// Format product status for display
function formatStatus(status) {
    switch(status) {
        case 'in-stock':
            return 'In Stock';
        case 'low-stock':
            return 'Low Stock';
        case 'out-of-stock':
            return 'Out of Stock';
        default:
            return status;
    }
}

// Add product to cart
function addToCart(e) {
    const productId = parseInt(e.currentTarget.getAttribute('data-id'));
    const product = products.find(item => item.id === productId);
    
    const existingItem = cart.find(item => item.product.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            product,
            quantity: 1
        });
    }
    
    updateCartCount();
    showToast(`${product.title} added to cart!`);
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count badge
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Render cart items
function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <button class="continue-shopping-btn">Start Shopping</button>
            </div>
        `;
        
        cartItems.querySelector('.continue-shopping-btn').addEventListener('click', closeModal);
        cartTotal.textContent = '$0.00';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.product.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.product.image}" alt="${item.product.title}">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.product.title}</h3>
                <div class="cart-item-price">$${item.product.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-actions">
                <div class="item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.product.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.product.id}">+</button>
                </div>
                <button class="remove-item" data-id="${item.product.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = `$${total.toFixed(2)}`;
    
    // Add event listeners to cart buttons
    document.querySelectorAll('.decrease').forEach(btn => {
        btn.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.increase').forEach(btn => {
        btn.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', removeItem);
    });
}

// Decrease item quantity
function decreaseQuantity(e) {
    const productId = parseInt(e.currentTarget.getAttribute('data-id'));
    const itemIndex = cart.findIndex(item => item.product.id === productId);
    
    if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity -= 1;
    } else {
        cart.splice(itemIndex, 1);
    }
    
    updateCartCount();
    renderCart();
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Increase item quantity
function increaseQuantity(e) {
    const productId = parseInt(e.currentTarget.getAttribute('data-id'));
    const itemIndex = cart.findIndex(item => item.product.id === productId);
    
    cart[itemIndex].quantity += 1;
    
    updateCartCount();
    renderCart();
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Remove item from cart
function removeItem(e) {
    const productId = parseInt(e.currentTarget.getAttribute('data-id'));
    const itemIndex = cart.findIndex(item => item.product.id === productId);
    
    const removedItem = cart[itemIndex];
    cart.splice(itemIndex, 1);
    
    updateCartCount();
    renderCart();
    showToast(`${removedItem.product.title} removed from cart`);
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Show toast notification
function showToast(message) {
    const toastMessage = document.querySelector('.toast-message');
    toastMessage.textContent = message;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Open modal (login or cart)
function openModal(modalElem) {
    modalElem.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    if (modalElem === cartModal) {
        renderCart();
    }
}

// Close any open modal
function closeModal() {
    loginModal.style.display = 'none';
    cartModal.style.display = 'none';
    document.body.style.overflow = '';
}

// Filter products by category
function filterProducts(e) {
    const category = e.target.getAttribute('data-filter');
    
    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    renderProducts(category);
}

// Toggle mobile menu
function toggleMobileMenu() {
    navLinks.classList.toggle('active');
}

// Setup all event listeners
function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', filterProducts);
    });
    
    // Login and Cart buttons
    loginBtn.addEventListener('click', () => openModal(loginModal));
    cartBtn.addEventListener('click', () => openModal(cartModal));
    
    // Close modal buttons
    closeModals.forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModal);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal || e.target === cartModal) {
            closeModal();
        }
    });
    
    // Mobile menu toggle
    menuIcon.addEventListener('click', toggleMobileMenu);
    
    // Continue shopping button
    continueShoppingBtn.addEventListener('click', closeModal);
    
    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Proceeding to checkout... (This would redirect to a checkout page)');
        }
    });
    
    // Form submission prevention
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (form.id === 'loginForm') {
                alert('Login successful! (This is a demo)');
                closeModal();
            } else if (form.classList.contains('newsletter-form')) {
                const email = form.querySelector('input[type="email"]').value;
                showToast(`Thank you for subscribing with ${email}!`);
                form.reset();
            }
        });
    });
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Hero CTA button
    document.querySelector('.cta-button').addEventListener('click', () => {
        document.querySelector('#products').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
