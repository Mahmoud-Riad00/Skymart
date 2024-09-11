let addedToCart = [];

function checkLoggedInUser() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        window.location.href = '../login&REGISTER/login.html';
    } else {
        document.querySelector('.profileLink').textContent = loggedInUser.userName;
    }
}

function redirectToLogin() {
    window.location.href = '../login&REGISTER/login.html';
}

function updateCartCount() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    let cartdata = loggedInUser ? JSON.parse(localStorage.getItem(`cartItem_${loggedInUser.userEmail}`)) || [] : [];
    let cartCount = cartdata.length;
    let cartCountElement = document.querySelector('.cart-count');
    let itemNumberElement = document.querySelector('.item-number');

    if (cartCountElement) cartCountElement.textContent = cartCount;
    if (itemNumberElement) itemNumberElement.innerHTML = `${cartCount}`;
}

function updateCheckout() {
    let totalItems = 0;
    let totalPrice = 0;

    addedToCart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
    });

    const checkoutElement = document.querySelector('.checkOut');
    if (checkoutElement) {
        checkoutElement.innerHTML = `
            <p>Total Items: ${totalItems}</p>
            <p>Total Price: ${totalPrice}$</p>
            <button class="check-out-btn">Checkout</button>
        `;

        document.querySelector('.check-out-btn').addEventListener('click', () => {
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

function updateCartView() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    let cartdata = loggedInUser ? JSON.parse(localStorage.getItem(`cartItem_${loggedInUser.userEmail}`)) || [] : [];
    let productView = document.querySelector('.product-view');
    
    if (!productView) return;

    productView.innerHTML = '';

    cartdata.forEach(item => {
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
}

function updateCartItemQuantity(productElement, quantity) {
    let productId = productElement.closest('.tacken-products').dataset.id;
    let cartItem = addedToCart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = quantity;
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            localStorage.setItem(`cartItem_${loggedInUser.userEmail}`, JSON.stringify(addedToCart));
        }
    }
}

function showCheckoutAlert() {
    let alertBox = document.getElementById('checkout-alert');
    if (alertBox) {
        alertBox.style.display = 'block';
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 5000);
    }
}

function attachCartEventListeners() {
    document.querySelectorAll('.increase').forEach(increase => {
        increase.addEventListener('click', event => {
            let productElement = event.currentTarget.closest('.product-ch');
            let numberOfProduct = productElement.querySelector('.number-of-product');
            let count = parseInt(numberOfProduct.textContent);
            numberOfProduct.textContent = count + 1;

            updateCartItemQuantity(productElement, count + 1);
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

document.addEventListener('DOMContentLoaded', function() {
    checkLoggedInUser();
    updateCartCount();

    const cartElement = document.querySelector('.cart');
    if (cartElement) {
        cartElement.addEventListener('click', function() {
            let content = document.querySelector('.cart-container');
            if (content) {
                if (content.style.display === 'none' || content.style.display === '') {
                    content.style.display = 'block';
                    updateCartView();
                } else {
                    content.style.display = 'none';
                }
            }
        });
    }

    const menuElement = document.querySelector('.menu');
    if (menuElement) {
        menuElement.addEventListener('click', () => {
            let logo = document.querySelector('.logo');
            let cart = document.querySelector('.cart');
            let links = document.querySelector('.links') || document.querySelector('.nav-menu');
            
            links.classList.toggle('active');
            
            if (links.classList.contains('active')) {
                if (cart) cart.style.display = 'none';
                if (logo) {
                    logo.style.display = 'none';
                    logo.classList.add('logo');
                }
            } else {
                if (cart) cart.style.display = 'block';
                if (logo) {
                    logo.style.display = 'flex';
                }
            }
        });
    }
});

window.addEventListener('scroll', () => {
    let scrollTimeout;
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        let nav = document.querySelector('.navSettings');
        if (window.scrollY > 100) {
            nav.style.width = '110vw';
            nav.style.borderRadius = '0rem';
        } else {
            nav.style.width = '';
            nav.style.borderRadius = '2rem';
        }
    }, 50);
});