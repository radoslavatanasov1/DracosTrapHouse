// Function to update the cart badge based on sessionStorage data
function updateCartBadge() {
    const cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    const cartBadge = document.querySelector('.cart-badge');
    
    if (cartBadge) {
        const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
        
        cartBadge.style.display = itemCount > 0 ? 'flex' : 'none';
        cartBadge.textContent = itemCount;
    }
}

// Function to add items to the cart
function addToCart(item) {
    // Check if the item has the required properties
    if (!item || !item.id || !item.name || !item.price || !item.image) {
        console.error("Invalid item structure. Item not added to cart.");
        return;
    }

    // Retrieve existing cart items from sessionStorage
    let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];

    // Check if the item already exists in the cart
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex > -1) {
        // If item exists, update the quantity
        cartItems[existingItemIndex].quantity += item.quantity;
    } else {
        // If item does not exist, add it to the cart
        cartItems.push(item);
    }

    // Update sessionStorage with the updated cart
    sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartBadge();
}

// Function to increase the quantity of an item
function increaseQuantity(index) {
    let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    cartItems[index].quantity += 1;
    sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
    displayCartItems();
    updateCartBadge();
}

// Function to decrease the quantity of an item
function decreaseQuantity(index) {
    let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    if (cartItems[index].quantity > 1) {
        cartItems[index].quantity -= 1;
    } else {
        cartItems.splice(index, 1); // Remove item if quantity reaches zero
    }
    sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
    displayCartItems();
    updateCartBadge();
}

// Function to remove an item from the cart
function removeFromCart(index) {
    let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    cartItems.splice(index, 1); // Remove the item at the specified index
    sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
    displayCartItems();
    updateCartBadge();
}

// Function to display cart items
function displayCartItems() {
    const cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    const cartContainer = document.querySelector('.cart-container');
    const cartSummary = document.querySelector('.cart-summary');
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
        
        // Display the cart summary
        cartSummary.style.display = 'block';
        cartSummary.innerHTML = `<h2>Cart Summary</h2>
                                 <p>Subtotal: $${calculateTotal()}</p>
                                 <p>Shipping: Free</p>
                                 <p>Total: $${calculateTotal()}</p>
                                 <button class="checkout-btn">Proceed to Checkout</button>`;
    } else {
        // Show empty cart message and hide summary
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        cartSummary.style.display = 'none';
    }
}

// Helper function to calculate the total
function calculateTotal() {
    const cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
}

// Add event listeners for "Add to Cart" buttons for multiple products
document.querySelectorAll('.buy-now').forEach(button => {
    button.addEventListener('click', function() {
        const item = {
            id: button.getAttribute('data-id'),
            name: button.getAttribute('data-name'),
            price: parseFloat(button.getAttribute('data-price')),
            quantity: 1, // Default quantity as 1
            image: button.getAttribute('data-image')
        };
        
        // Add item to cart
        addToCart(item);
    });
});

// Initialize cart badge and items on page load
window.onload = function() {
    updateCartBadge();
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems(); // Load items if on cart page
    }
};
