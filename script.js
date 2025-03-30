const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('[data-scroll]').forEach((element) => {
    observer.observe(element);
});

// Search functionality
const searchIcon = document.querySelector('.search-icon');
const searchBar = document.querySelector('.search-bar');

searchIcon.addEventListener('click', () => {
    searchBar.classList.toggle('active');
    if (searchBar.classList.contains('active')) {
        searchBar.focus();
    }
});

// Close search bar when clicking outside
document.addEventListener('click', (e) => {
    if (!searchIcon.contains(e.target) && !searchBar.contains(e.target)) {
        searchBar.classList.remove('active');
    }
});

// Cart functionality
let cartCount = 0;
let cartProducts = new Map(); // Using Map to maintain insertion order
const cartCountDisplay = document.querySelector('.cart-count');
const products = document.querySelectorAll('.product');

products.forEach((product, index) => {
    const cartIcon = product.querySelector('.product-cart');
    const qtyControls = product.querySelector('.quantity-controls');
    const minusBtn = product.querySelector('.minus');
    const plusBtn = product.querySelector('.plus');
    const qtyDisplay = product.querySelector('.qty-display');
    let qty = 0;

    function updateDisplays() {
        qtyDisplay.textContent = qty;
        cartCountDisplay.textContent = cartCount;
        
        const productName = `Product ${index + 1}`; // Unique name for each product
        const productImg = product.querySelector('img').src;
        const price = 200;
        
        if (qty > 0) {
            cartProducts.set(productName, {
                quantity: qty,
                image: productImg,
                price: price,
                timestamp: Date.now()
            });
        } else {
            cartProducts.delete(productName);
        }
        updateCartSidebar();
    }

    cartIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        qtyControls.classList.remove('hidden');
        if (qty === 0) {
            qty = 1;
            cartCount++;
            updateDisplays();
        }
    });

    minusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (qty > 0) {
            qty--;
            cartCount--;
            if (qty === 0) {
                qtyControls.classList.add('hidden');
            }
            updateDisplays();
        }
    });

    plusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        qty++;
        cartCount++;
        updateDisplays();
    });
});

// Cart sidebar functionality
const cartIcon = document.querySelector('.cart-icon');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartOverlay = document.querySelector('.cart-overlay');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.querySelector('.cart-items');

cartIcon.addEventListener('click', toggleCart);
closeCart.addEventListener('click', toggleCart);
cartOverlay.addEventListener('click', toggleCart);

function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

function updateCartSidebar() {
    cartItems.innerHTML = '';
    let total = 0;
    
    const sortedProducts = Array.from(cartProducts.entries())
        .filter(([_, details]) => details.quantity > 0);
    
    if (sortedProducts.length === 0) {
        cartItems.innerHTML = '<div class="cart-item empty-cart">Your cart is empty</div>';
        document.querySelector('.total').textContent = 'Total: $0';
        return;
    }
    
    sortedProducts.forEach(([productName, details]) => {
        const itemTotal = details.price * details.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${details.image}" alt="${productName}">
            <div class="cart-item-details">
                <div class="cart-item-info">
                    <h3>${productName}</h3>
                    <p>Price: $${details.price}</p>
                    <p>Total: $${itemTotal}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="cart-qty-btn minus">-</button>
                    <span class="cart-qty-display">${details.quantity}</span>
                    <button class="cart-qty-btn plus">+</button>
                </div>
            </div>
        `;

        // Add event listeners for quantity controls in cart
        const minusBtn = cartItem.querySelector('.minus');
        const plusBtn = cartItem.querySelector('.plus');
        
        minusBtn.addEventListener('click', () => {
            const product = document.querySelectorAll('.product')[parseInt(productName.split(' ')[1]) - 1];
            const productMinusBtn = product.querySelector('.minus');
            productMinusBtn.click();
        });

        plusBtn.addEventListener('click', () => {
            const product = document.querySelectorAll('.product')[parseInt(productName.split(' ')[1]) - 1];
            const productPlusBtn = product.querySelector('.plus');
            productPlusBtn.click();
        });

        cartItems.appendChild(cartItem);
    });
    
    document.querySelector('.total').textContent = `Total: $${total}`;
}

// Home button scroll functionality

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent instant jump

        const targetId = this.getAttribute('href').substring(1); // Get section ID
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 50, // Adjust offset if needed
                behavior: 'smooth' // Enable smooth scrolling
            });
        }
    });
});


// Navigation scroll functionality
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const navHeight = document.querySelector('.top-nav').offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Mobile menu functionality
const menuIcon = document.querySelector('.menu-icon');
const mobileSidebar = document.querySelector('.mobile-sidebar');
const mobileOverlay = document.querySelector('.mobile-overlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

function toggleMobileMenu() {
    mobileSidebar.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
}

menuIcon.addEventListener('click', toggleMobileMenu);
mobileOverlay.addEventListener('click', toggleMobileMenu);

mobileNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const navHeight = document.querySelector('.top-nav').offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            toggleMobileMenu(); // Close the sidebar after clicking
        }
    });
});

// Ensure video plays on mobile
const video = document.querySelector('.background-video');
video.play().catch(function(error) {
    console.log("Video play failed", error);
});

// Handle visibility changes
document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === 'visible') {
        video.play().catch(function(error) {
            console.log("Video play failed on visibility change", error);
        });
    }
});
// Fallback: Play on user interaction if autoplay fails
document.body.addEventListener("click", () => {
    if (video.paused) {
        video.play().catch((error) => {
            console.log("Video play failed on click:", error);
        });
    }
}, { once: true });
