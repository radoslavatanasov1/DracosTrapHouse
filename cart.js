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
    if (!item || !item.id || !item.name || !item.price || !item.image) {
        console.error("Invalid item structure. Item not added to cart.");
        return;
    }

    let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += item.quantity;
    } else {
        cartItems.push(item);
    }

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
        cartItems.splice(index, 1);
    }
    sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
    displayCartItems();
    updateCartBadge();
}

// Function to remove an item from the cart
function removeFromCart(index) {
    let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    cartItems.splice(index, 1);
    sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
    displayCartItems();
    updateCartBadge();
}

// Function to display cart items
function displayCartItems() {
    const cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    const cartContainer = document.querySelector('.cart-container');
    const cartSummary = document.querySelector('.cart-summary');
    cartContainer.innerHTML = '';

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

        // Display the Buy With Prime cart widget in the summary
        cartSummary.style.display = 'block';
        cartSummary.innerHTML = `
            <h2>Cart Summary</h2>
            <p>Subtotal: $${calculateTotal()}</p>
            <div
                id="amzn-bwp-cart"
                data-site-id="9bwvxpevcd"
                data-widget-id="w-oCpdzLyGfl5wnP1aa7ghn5">
            </div>
        `;

        // Re-initialize the Buy With Prime widget after updating the cart summary
        if (window.BuyWithPrime) {
            BuyWithPrime.refresh();
        }
    } else {
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
            quantity: 1,
            image: button.getAttribute('data-image')
        };
        addToCart(item);
    });
});

// Initialize cart badge and items on page load
window.onload = function () {
    updateCartBadge();
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
};