async function fetchSingleProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        console.error('No product ID provided');
        return;
    }

    try {
        const response = await fetch(`https://api.escuelajs.co/api/v1/products/${productId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const product = await response.json();

        const singleProductElement = document.getElementById('single-product');
        singleProductElement.innerHTML = `
            <div class="single-product-card">
                <div class="product-images">
                    <img src="${product.images[0]}" alt="${product.title}" class="main-product-image">
                    <div class="small-container-wrapper">
                        <div class="small-container">
                            ${product.images.map((img, index) => `
                                <img src="${img}" alt="${product.title} ${index + 1}" class="small-product-image" data-index="${index}">
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="single-product-details">
                    <h1>${product.title}</h1>
                    <p class="single-product-category">Category: ${product.category.name}</p>
                    <p class="single-product-description">${product.description}</p>
                    <p class="single-product-price">$${product.price}</p>
                    <button class="buy-now-btn">Buy Now</button>
                </div>
            </div>
        `;

        // Add event listeners to small images
        const smallImages = document.querySelectorAll('.small-product-image');
        const mainImage = document.querySelector('.main-product-image');

        smallImages.forEach(img => {
            img.addEventListener('click', () => {
                mainImage.src = img.src;
            });
        });

    } catch (error) {
        console.error('Error fetching product:', error);
    }
}

window.onload = fetchSingleProduct;
