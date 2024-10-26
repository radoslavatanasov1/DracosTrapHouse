// Function to update cart badge
function updateCartBadge() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartBadge = document.querySelector('.cart-badge');
    
    // Check if the badge element exists before modifying it
    if (cartBadge) {
        const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
        
        // Always display the badge, defaulting to "0" if no items
        cartBadge.style.display = 'flex';
        cartBadge.textContent = itemCount > 0 ? itemCount : '0';
    }
}

// Add item to cart
function addToCart(item) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Check if the item is already in the cart
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.name === item.name);
    if (existingItemIndex !== -1) {
        // If item already exists in cart, update the quantity
        cartItems[existingItemIndex].quantity += item.quantity;
    } else {
        // If item does not exist, add it to cart
        cartItems.push(item);
    }

    // Store updated cart in localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Update the cart badge
    updateCartBadge();
}

// Function to remove item from the cart
function removeFromCart(index) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Remove the item by its index
    cartItems.splice(index, 1);

    // Store updated cart in localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Update the cart badge
    updateCartBadge();

    // Refresh the cart display (on the cart.html page)
    displayCartItems();
}

// Display cart items on cart.html
function displayCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartContainer = document.querySelector('.cart-container');
    cartContainer.innerHTML = ''; // Clear previous content

    if (cartItems.length > 0) {
        cartItems.forEach((item, index) => {
            cartContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>$${item.price}</p>
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="decreaseQuantity(${index})">-</button>
                            <input type="number" value="${item.quantity}" class="quantity-input" readonly>
                            <button class="quantity-btn" onclick="increaseQuantity(${index})">+</button>
                        </div>
                        <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
                </div>
            `;
        });
    } else {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    }

    updateCartSummary();
}

// Function to increase the quantity of an item
function increaseQuantity(index) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems[index].quantity += 1;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    displayCartItems();
    updateCartBadge();
}

// Function to decrease the quantity of an item
function decreaseQuantity(index) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (cartItems[index].quantity > 1) {
        cartItems[index].quantity -= 1;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        displayCartItems();
        updateCartBadge();
    }
}

// Update cart summary
function updateCartSummary() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartSummary = document.querySelector('.cart-summary');
    cartSummary.innerHTML = `
        <h2>Cart Summary</h2>
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <p>Shipping: Free</p>
        <p>Total: $${subtotal.toFixed(2)}</p>
        <button class="checkout-btn">Proceed to Checkout</button>
    `;
}

// Add event listener for "Add to Cart" button (on the product page)
const addToCartButton = document.querySelector('.buy-now');
if (addToCartButton) {
    addToCartButton.addEventListener('click', function() {
        const item = {
            name: 'Electric Scrub Brush',
            price: 24.99,
            quantity: 1,
            image: 'scrubBrush/electric spin white bg.jpg'
        };
        addToCart(item);
    });
}

// Initialize cart badge and items on page load
window.onload = function() {
    updateCartBadge();
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems(); // Load items if on cart page
    }
};
