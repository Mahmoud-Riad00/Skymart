function checkLoggedInUser() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        window.location.href = '../login&REGISTER/login.html';
    } else {
        document.querySelector('.profileLink').textContent = loggedInUser.userName;
    }
}

let products = document.querySelector('.products');
let nav = document.querySelector('.navSettings');
let cartContainer = document.querySelector('.up-container');
let productView = document.querySelector('.product-view');
let addedToCart = [];

// Function to update cart count
function updateCartCount() {
    let cartCount = addedToCart.length;
    let cartCountElement = document.querySelector('.cart-count');
    let itemNumberElement = document.querySelector('.item-number');

    if (cartCountElement) cartCountElement.textContent = cartCount;
    if (itemNumberElement) itemNumberElement.innerHTML = `${cartCount}`;
}

// Scroll event to adjust navbar
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const nav = document.querySelector('.navSettings');
        const upContainer = document.querySelector('.up-container');
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
            upContainer.style.display = 'flex';
        } else {
            nav.classList.remove('scrolled');
            upContainer.style.display = 'none';
        }
    }, 0);
});

// Fetch product data
async function getData() {
    try {
        let dataRes = await fetch('https://api.escuelajs.co/api/v1/products');
        let data = await dataRes.json();

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
        
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        addedToCart = JSON.parse(localStorage.getItem(`cartItem_${loggedInUser.userEmail}`)) || [];
        
        updateCartCount();
        updateCartView();
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
}

// Attach click event listeners to cards
function attachCardEventListeners(data) {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', event => {
            let productId = event.currentTarget.dataset.id;
            window.location.href = `https://mahmoud-riad00.github.io/Skymart/singleProduct/singleProduct.html?id=${productId}`;
        });
    });

    document.querySelectorAll('.pr-d button').forEach(buy => {
        buy.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            addToCart(event, data);
        });
    });
}

// Add product to cart
function addToCart(event, data) {
    let productId = event.currentTarget.closest('.card').dataset.id;
    let product = data.find(item => item.id == productId);
    let productPrice = product.price;
    let productImages = product.images || [];

    if (!addedToCart.some(item => item.id === productId)) {
        addedToCart.push({
            id: productId,
            Images: productImages,
            price: productPrice,
            quantity: 1
        });
    } else {
        let cartItem = addedToCart.find(item => item.id === productId);
        cartItem.quantity += 1;
    }

    updateCartCount();
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    localStorage.setItem(`cartItem_${loggedInUser.userEmail}`, JSON.stringify(addedToCart));
    updateCartView();
    toggleProductAddedMessage(event);
}

// Toggle product added message
function toggleProductAddedMessage(event) {
    let productDone = event.currentTarget.closest('.pr-d').querySelector('.product-done');
    let buyButton = event.currentTarget;
    let price = event.currentTarget.closest('.pr-d').querySelector('.price');

    if (addedToCart.length > 0) {
        productDone.style.display = 'block';
        buyButton.style.display = 'none';
        price.style.display = 'none';
    } else {
        productDone.style.display = 'none';
        buyButton.style.display = 'block';
        price.style.display = 'block';
    }
}

// Update cart view
function updateCartView() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    let cartdata = JSON.parse(localStorage.getItem(`cartItem_${loggedInUser.userEmail}`)) || [];
    productView.innerHTML = '';

    cartdata.forEach(item => {
        productView.innerHTML += `
        <div class="tacken-products" data-id="${item.id}">
            <div class="product-ch">
                <img src="${item.Images[0]}">
                <div class="ch-btn">
                    <p>${item.price}$$</p>
                    <button class="increase">+</button>
                    <button class="decrease">-</button>
                    <p class="number-of-product">${item.quantity}</p>
                </div>
            </div>
        </div>`;
    });

    attachCartEventListeners();
    updateCheckout();
}

// Attach event listeners for cart items
function attachCartEventListeners() {
    document.querySelectorAll('.increase').forEach(increase => {
        increase.addEventListener('click', event => {
            let productElement = event.currentTarget.closest('.product-ch');
            let numberOfProduct = productElement.querySelector('.number-of-product');
            let count = parseInt(numberOfProduct.textContent);
            numberOfProduct.textContent = count + 1;

            updateCartItemQuantity(productElement, count + 1);
            updateCartCount();
            updateCheckout();
        });
    });

    document.querySelectorAll('.decrease').forEach(decrease => {
        decrease.addEventListener('click', event => {
            let productElement = event.currentTarget.closest('.product-ch');
            let numberOfProduct = productElement.querySelector('.number-of-product');
            let count = parseInt(numberOfProduct.textContent);
            let productId = productElement.closest('.tacken-products').dataset.id;

            if (count === 1) {
                addedToCart = addedToCart.filter(item => item.id !== productId);
                localStorage.setItem('cartItem', JSON.stringify(addedToCart));
                productElement.closest('.tacken-products').remove();
            } else {
                numberOfProduct.textContent = count - 1;
                updateCartItemQuantity(productElement, count - 1);
            }
            updateCartCount();
            updateCheckout();
        });
    });
}

// Update cart item quantity and local storage
function updateCartItemQuantity(productElement, quantity) {
    let productId = productElement.closest('.tacken-products').dataset.id;
    let cartItem = addedToCart.find(item => item.id === productId);
    cartItem.quantity = quantity;
    localStorage.setItem('cartItem', JSON.stringify(addedToCart));
}

// Update checkout summary
function updateCheckout() {
    let totalItems = 0;
    let totalPrice = 0;

    addedToCart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
    });

    document.querySelector('.checkOut').innerHTML = `
        <p>Total Items: ${totalItems}</p>
        <p>Total Price: ${totalPrice}$</p>
        <button class="check-out-btn">Checkout</button>
    `;
    updateCartCount();
    const checkoutButton = document.querySelector('.check-out-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (addedToCart.length > 0) {
                addedToCart = [];
                localStorage.removeItem('cartItem');
                updateCartView();
                updateCartCount();
                showCheckoutAlert();
            } else {
                alert('Your cart is empty!');
            }
        });
    }
}

// Show checkout alert
function showCheckoutAlert() {
    let alertBox = document.getElementById('checkout-alert');
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 5000); 
}

// Toggle cart container visibility
document.querySelector('.cart').addEventListener('click', function() {
    let content = document.querySelector('.cart-container');
    let container = document.querySelector('.container');

    content.style.display = content.style.display === 'none' || content.style.display === '' ? 'block' : 'none';
    container.style.justifyContent = content.style.display === 'block' ? 'center' : 'space-between';
});

// Initialize the application
window.onload = function() {
    checkLoggedInUser();
    getData();
};

// Menu toggle for mobile view
let menu = document.querySelector('.menu');
menu.addEventListener('click', () => {
    let logo = document.querySelector('.logo');
    let cart = document.querySelector('.cart');
    let links = document.querySelector('.links');

    links.classList.toggle('active');
    
    if (links.classList.contains('active')) {
        cart.style.display = 'none';
        logo.style.display = 'none';
    } else {
        cart.style.display = 'block';
        logo.style.display = 'block';
    }
});
