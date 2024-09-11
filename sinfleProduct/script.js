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
    singleProductContainer.innerHTML = `
        <div class="single-product-card">
            <img src="${product.images[0]}" alt="${product.title}" class="single-product-image">
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

window.onload = fetchSingleProduct;
