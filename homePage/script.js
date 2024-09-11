const slidShow = document.querySelector(".sld-img");
const MainPhoto = document.querySelector(".sld-big-img");
const nav = document.querySelector('.navSettings');
const categoryDescription = document.querySelector('.category-description');
const products = document.querySelector('.products');
let data = [];
let allProducts = [];
let currentindex = 0;
const descriptions = [
    {
        name: "Clothes",
        description: "Explore our stylish apparel collection for every occasion! From chic casual wear to elegant formal attire, find the perfect outfit that expresses your unique style and keeps you comfortable all year round."
    },
    {
        name: "Electronics",
        description: "Discover the latest in cutting-edge technology! Our selection includes smartphones, powerful laptops, and smart home devices that enhance convenience and connectivity, making everyday life extraordinary."
    },
    {
        name: "Furniture",
        description: "Elevate your living space with our exquisite furniture! Choose from cozy sofas, elegant dining tables, and chic office chairs, all designed for quality and modern aesthetics to create your dream home."
    },
    {
        name: "Shoes",
        description: "Step out in style with our fabulous footwear collection! From trendy sneakers to sophisticated heels, enjoy the perfect blend of comfort and fashion that keeps you looking and feeling great with every step."
    },
    {
        name: "Miscellaneous",
        description: "Unearth unique treasures in our Miscellaneous category! From quirky novelty items to essential household goods, explore a diverse range of products that add joy and excitement to your shopping experience."
    }
];

// Add these functions at the beginning of the file
function checkLoggedInUser() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        document.querySelector('.loginLink').style.display = 'none';
        document.querySelector('.profileLink').style.display = 'block';
        document.querySelector('.profileLink').textContent = loggedInUser.userName;
    } else {
        document.querySelector('.loginLink').style.display = 'block';
        document.querySelector('.profileLink').style.display = 'none';
    }
}

function redirectToLogin() {
    window.location.href = '../login&REGISTER/login.html';
}

// Function to update cart count
function updateCartCount() {
    let cartCount = addedToCart.length;
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

    document.querySelector('.checkOut').innerHTML = `
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

// Add this function to update the cart view
function updateCartView() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    let cartdata = loggedInUser ? JSON.parse(localStorage.getItem(`cartItem_${loggedInUser.userEmail}`)) || [] : [];
    let productView = document.querySelector('.product-view');
    
    if (!productView) return; // Exit if the product-view element doesn't exist

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

async function getData() {
    try {
        let dataRes = await fetch("https://api.escuelajs.co/api/v1/categories");
        if (!dataRes.ok) throw new Error('Network response was not ok');
        
        let allProductsRes = await fetch('https://api.escuelajs.co/api/v1/products');
        if (!allProductsRes.ok) throw new Error('Network response was not ok');

        data = await dataRes.json();
        allProducts = await allProductsRes.json();
        
        const categoriesToDisplay = data.slice(0, 5);
        categoriesToDisplay.forEach((category, index) => {
            slidShow.innerHTML += `<img class="small-img" src="${category.image}" data-index="${index}">`;
        });

        updateMainimg();
        autoSlid();

        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            addedToCart = JSON.parse(localStorage.getItem(`cartItem_${loggedInUser.userEmail}`)) || [];
        } else {
            addedToCart = [];
        }

        updateCartCount();
        updateCartView();
        updateCheckout();
    } catch (error) {
        console.error("Error fetching data:", error);
        alert('There was an error loading the categories. Please try again later.');
    }
}

// Modify the updateCartItemQuantity function
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

// Replace the window.onload function with this:
document.addEventListener('DOMContentLoaded', function() {
    checkLoggedInUser();
    getData();

    // Move the cart click event listener here
    const cartElement = document.querySelector('.cart');
    if (cartElement) {
        cartElement.addEventListener('click', function() {
            let content = document.querySelector('.cart-container');
            if (content) {
                if (content.style.display === 'none' || content.style.display === '') {
                    content.style.display = 'block';
                    updateCartView(); // Update the cart view when opened
                } else {
                    content.style.display = 'none';
                }
            }
        });
    }

    // Add event listener for "Buy Now" button
    const buyNowButton = document.querySelector('.cat-product a');
    if (buyNowButton) {
        buyNowButton.addEventListener('click', (event) => {
            event.preventDefault();
            const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
            if (loggedInUser) {
                window.location.href = 'https://mahmoud-riad00.github.io/Skymart/products/products.html';
            } else {
                redirectToLogin();
            }
        });
    }

    // Add menu click event listener here
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

// Remove these event listeners from their current positions
// document.querySelector('.cart').addEventListener('click', function() { ... });
// let menu = document.querySelector('.menu');
// menu.addEventListener('click', () => { ... });

// ... (keep all the other functions as they are)

function updateMainimg() {
    MainPhoto.innerHTML = `<img class="big-img" src="${data[currentindex].image}">`;
    categoryDescription.innerHTML = `
        <h1>${data[currentindex].name}</h1>
        <p>${descriptions[currentindex].description}</p>
        <div class="cat-product"><a href="https://mahmoud-riad00.github.io/Skymart/products/products.html">Buy Now</a></div>`;
}

function autoSlid() {
    setInterval(() => {
        currentindex = (currentindex + 1) % 5;
        updateMainimg();
    }, 5000);
}

window.addEventListener('scroll', () => {
    let scrollTimeout;
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        if (window.scrollY > 100) {
            nav.style.width = '110vw';
            nav.style.borderRadius = '0rem';
        } else {
            nav.style.width = '';
            nav.style.borderRadius = '2rem';
        }
    }, 50);
});

slidShow.addEventListener('click', (event) => {
    if (event.target.classList.contains('small-img')) {
        currentindex = parseInt(event.target.getAttribute('data-index'));
        updateMainimg();
    }
});
function showCheckoutAlert() {
    let alertBox = document.getElementById('checkout-alert');
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 5000); 
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
