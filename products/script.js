let products = document.querySelector('.products');
let data = [];
const nav = document.querySelector('.navSettings');
let currentIndex = 0;
let cartContainer = document.querySelector('.up-container')
let addedToCart = JSON.parse(localStorage.getItem('cartItem')) || [];
var cartdata;
let itemNumber = document.querySelector('.item-number');

function updateCartCount() {
    let cartCount = addedToCart.length;
    let cartCountElement = document.querySelector('.cart-count');
    let itemNumberElement = document.querySelector('.item-number');
    
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
    
    if (itemNumberElement) {
        itemNumberElement.innerHTML = `${cartCount}`;
    }
}

let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        if (window.scrollY > 100) {
            nav.style.width = '100vw';
            nav.style.borderRadius = '0rem';
            nav.style.justifyContent = 'space-evenly';
            cartContainer.style.display = 'block';
        } else {
            nav.style.width = '';
            nav.style.borderRadius = '2rem';
            nav.style.justifyContent = 'space-between';
            cartContainer.style.display = 'none';
        }
    }, 50);
});

async function getData() {
    let dataRes = await fetch('https://api.escuelajs.co/api/v1/products');
    data = await dataRes.json();
   
    console.log(data);

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
                    <a>Buy now <img class="cart-buy" src="./Media/shopping-cart.png" alt="cart-buy"></a>
                    <div class="product-done"><p>Successfully Added to Cart</p><img src=""></div>
                </div>
            </div>
        </div>
        `;

        products.innerHTML += productHTML;
    });

    document.querySelectorAll('.card').forEach((card) => {
        card.addEventListener('click', (event) => {
            let productId = event.currentTarget.dataset.id;
            console.log(productId);
        });
    });

    document.querySelectorAll('.pr-d a').forEach((buy) => {
        buy.addEventListener('click', (event) => {
            event.preventDefault();
            let productId = event.currentTarget.closest('.card').dataset.id;

            if (!addedToCart.some(item => item.id === productId)) {
                addedToCart.push({ id: productId });
                localStorage.setItem('cartItem', JSON.stringify(addedToCart));

                let productDone = event.currentTarget.closest('.pr-d').querySelector('.product-done');
                productDone.style.display = 'block';
                event.currentTarget.style.display = 'none';
                let price = event.currentTarget.closest('.pr-d').querySelector('.price');
                price.style.display = 'none';
                updateCartCount();
            }
        });
    });

    cartdata = JSON.parse(localStorage.getItem("cartItem"));
    console.log(cartdata);
    noteArray = data || [];
    RestoreData();
    getDataFromSecondArray();
}

function RestoreData() {
    let cartdata = JSON.parse(localStorage.getItem("cartItem")) || [];
    document.querySelectorAll('.card').forEach((card) => {
        let cardId = card.getAttribute('data-id');
        if (cartdata.some(item => item.id === cardId)) {
            let productDone = card.querySelector('.product-done');
            let buyButton = card.querySelector('.pr-d a');
            let price = card.querySelector('.price');
            
            productDone.style.display = 'block';
            buyButton.style.display = 'none';
            price.style.display = 'none';
            updateCartCount();
        }
    });

    function getDataFromSecondArray(cartdata, data) {
        return cartdata.map(item1 => {
            const matchedItem = data.find(item2 => item2.id === item1.id);
            return { ...item1, ...matchedItem };  // Merge matched item data
        }).filter(item => item.id);  // Ensure only valid matches are returned
    }

}

window.onload = function() {
    addedToCart = JSON.parse(localStorage.getItem('cartItem')) || [];
    updateCartCount();
}

getData();
