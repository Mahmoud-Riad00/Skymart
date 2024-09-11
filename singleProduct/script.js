async function fetchSingleProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        console.error('No product ID provided');
        return;
    }

    try {
        const response = await fetch(`https://api.escuelajs.co/api/v1/products/${productId}`);
        const product = await response.json();

        displaySingleProduct(product);
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
}

function displaySingleProduct(product) {
    const singleProductContainer = document.getElementById('single-product');
    const smallContainer = document.querySelector('.small-container');
    
    // Clear previous content
    smallContainer.innerHTML = '';
    
    // Display small images in a row
    for(let x = 0; x < product.images.length; x++){
        smallContainer.innerHTML += `
        <img src="${product.images[x]}" alt="${product.title}" class="small-product-image" onclick="updateMainImage(this.src)">
        `;
    }
    
    // Set initial main image and product details
    singleProductContainer.innerHTML = `
        <div class="single-product-card">
            <div class="product-images">
                <img src="${product.images[0]}" alt="${product.title}" class="main-product-image" id="mainImage">
                <div class="small-container-wrapper">
                    ${smallContainer.outerHTML}
                </div>
            </div>
            <div class="single-product-details">
                <h1>${product.title}</h1>
                <p class="single-product-category">${product.category.name}</p>
                <p class="single-product-description">${product.description}</p>
                <p class="single-product-price">$${product.price}</p>
                <button class="buy-now-btn">Buy Now</button>
            </div>
        </div>
    `;
}

function updateMainImage(src) {
    document.getElementById('mainImage').src = src;
}

window.onload = fetchSingleProduct;
