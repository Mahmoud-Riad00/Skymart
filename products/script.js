let products = document.querySelector('.products');
let nav = document.querySelector('.navSettings');
let cartContainer = document.querySelector('.up-container');
let productView = document.querySelector('.product-view');
let currentUser = null;

// Function to get current user from URL
function getCurrentUser() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('username');
}

// Function to get user-specific cart key
function getUserCartKey(username) {
    return `cartItem_${username}`;
}

// Function to update cart count
function updateCartCount() {
    let cartKey = getUserCartKey(currentUser);
    let cartData = JSON.parse(localStorage.getItem(cartKey)) || [];
    let cartCount = cartData.reduce((total, item) => total + item.quantity, 0);
    let cartCountElement = document.querySelector('.cart-count');
    let itemNumberElement = document.querySelector('.item-number');

    if (cartCountElement) cartCountElement.textContent = cartCount;
    if (itemNumberElement) itemNumberElement.innerHTML = `${cartCount}`;
}

// ... [keep the scroll event listener as is] ...

// Fetch product data
async function getData() {
    try {
        let dataRes = await fetch('https://api.escuelajs.co/api/v1/products');
        let data = await dataRes.json();

        products.innerHTML = ''; // Clear existing content
        data.forEach((product, index) => {
            let productHTML = `
            <div class="card" data-index="${index}" data-id="${product.id}">
                <div class="img-container">
                    <img src="${product.images[0]}" alt="${product.title}">
                    <a class="categInfo">${product.category.name}</a>
                </div>
                <div class="card-txt">
                    <h3 class="product-name">${product.title}</h3>
                    <div class="pr-d">
                        <h1 class="price">${product.price}$</h1>
                        <button>Buy now <img class="cart-buy" src="./Media/shopping-cart.png" alt="cart-buy"></button>
                        <div class="product-done"><p>Successfully Added to Cart</p><img src=""></div>
                    </div>
                </div>
            </div>`;
            products.innerHTML += productHTML;
        });

        attachCardEventListeners(data);
        updateCartView();
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
}

// ... [keep attachCardEventListeners as is] ...

// Add product to cart
function addToCart(event, data) {
    if (!currentUser) {
        alert('Please log in to add items to your cart.');
        return;
    }

    let productId = event.currentTarget.closest('.card').dataset.id;
    let product = data.find(item => item.id == productId);
    let productPrice = product.price;
    let productImages = product.images || [];

    let cartKey = getUserCartKey(currentUser);
    let cartData = JSON.parse(localStorage.getItem(cartKey)) || [];

    let existingItem = cartData.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartData.push({
            id: productId,
            Images: productImages,
            price: productPrice,
            quantity: 1
        });
    }

    localStorage.setItem(cartKey, JSON.stringify(cartData));
    updateCartCount();
    updateCartView();
    toggleProductAddedMessage(event);
}

// ... [keep toggleProductAddedMessage as is] ...

// Update cart view
function updateCartView() {
    if (!currentUser) {
        productView.innerHTML = '<p>Please log in to view your cart.</p>';
        return;
    }

    let cartKey = getUserCartKey(currentUser);
    let cartData = JSON.parse(localStorage.getItem(cartKey)) || [];
    productView.innerHTML = '';

    cartData.forEach(item => {
        productView.innerHTML += `
        <div class="tacken-products" data-id="${item.id}">
            <div class="product-ch">
                <img src="${item.Images[0]}">
                <div class="ch-btn">
                    <p>${item.price}$</p>
                    <button class="increase">+</button>
                    <button class="decrease">-</button>
                    <p class="number-of-product">${item.quantity}</p>
                </div>
            </div>
        </div>`;
    });

    attachCartEventListeners();
    updateCheckout();
    updateCartCount();
}

// ... [keep attachCartEventListeners as is] ...

// Update cart item quantity and local storage
function updateCartItemQuantity(productElement, quantity) {
    let productId = productElement.closest('.tacken-products').dataset.id;
    let cartKey = getUserCartKey(currentUser);
    let cartData = JSON.parse(localStorage.getItem(cartKey)) || [];
    let cartItem = cartData.find(item => item.id === productId);
    
    if (cartItem) {
        cartItem.quantity = quantity;
        if (quantity === 0) {
            cartData = cartData.filter(item => item.id !== productId);
        }
        localStorage.setItem(cartKey, JSON.stringify(cartData));
    }
}

function updateCheckout() {
    if (!currentUser) {
        document.querySelector('.checkOut').innerHTML = '<p>Please log in to checkout.</p>';
        return;
    }

    let cartKey = getUserCartKey(currentUser);
    let cartData = JSON.parse(localStorage.getItem(cartKey)) || [];
    let totalItems = cartData.reduce((total, item) => total + item.quantity, 0);
    let totalPrice = cartData.reduce((total, item) => total + (item.price * item.quantity), 0);

    document.querySelector('.checkOut').innerHTML = `
        <p>Total Items: ${totalItems}</p>
        <p>Total Price: ${totalPrice}$</p>
        <button class="check-out-btn">Checkout</button>
         updateCartCount();
    `;

    const checkoutButton = document.querySelector('.check-out-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cartData.length > 0) {
                localStorage.removeItem(cartKey);
                updateCartView();
                updateCartCount();
                showCheckoutAlert();
            } else {
                alert('Your cart is empty!');
            }
        });
    }
}

n
window.onload = function() {
    currentUser = getCurrentUser();
    if (currentUser) {
        console.log(`Logged in as: ${currentUser}`);
        document.querySelector('.user-welcome').textContent = `Welcome, ${currentUser}!`;
    } else {
        console.log('No user logged in');
        document.querySelector('.user-welcome').textContent = 'Please log in';
    }
    updateCartCount();
    updateCartView();
    updateCheckout();
    getData();
};

