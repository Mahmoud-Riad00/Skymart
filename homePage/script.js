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
        name: "Trendy Apparel",
        description: "Discover fashion that speaks to your style! Our clothing collection features the latest trends, from casual chic to elegant evening wear. Express yourself with our high-quality, comfortable pieces that are perfect for any occasion."
    },
    {
        name: "Cutting-Edge Electronics",
        description: "Step into the future with our state-of-the-art electronics! From powerful smartphones to smart home devices, we offer the latest tech to enhance your daily life. Experience innovation at your fingertips."
    },
    {
        name: "Stylish Home Furnishings",
        description: "Transform your living space into a haven of comfort and style. Our furniture collection combines modern aesthetics with timeless elegance, offering pieces that not only look great but also provide ultimate comfort."
    },
    {
        name: "Footwear for Every Step",
        description: "Put your best foot forward with our diverse shoe collection. Whether you're looking for athletic performance, casual comfort, or elegant dress shoes, we have the perfect pair to complement your style and support your every step."
    },
    {
        name: "Unique Finds",
        description: "Explore a world of wonder in our Miscellaneous category! From quirky gadgets to essential everyday items, discover unique products that add a touch of excitement to your life. You never know what treasures you might find!"
    }
];

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
