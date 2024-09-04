document.addEventListener('DOMContentLoaded', function () {
    // Fetch products for products page
    if (document.getElementById('products-container')) {
        fetch('https://fakestoreapi.com/products')
            .then(response => response.json())
            .then(products => {
                const productsContainer = document.getElementById('products-container');
                products.forEach(product => {
                    const productElement = `
                        <div class="product-card">
                            <img src="${product.image}" alt="${product.title}">
                            <h2>${product.title}</h2>
                            <p>$${product.price}</p>
                            <a href="single-product.html?id=${product.id}" class="view-details-btn">View Details</a>
                        </div>`;
                    productsContainer.innerHTML += productElement;
                });
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    // Fetch single product details for product page
    if (document.getElementById('single-product-container')) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        fetch(`https://fakestoreapi.com/products/${productId}`)
            .then(response => response.json())
            .then(product => {
                document.getElementById('product-title').textContent = product.title;
                document.getElementById('product-image').src = product.image;
                document.getElementById('product-description').textContent = product.description;
                document.getElementById('product-price').textContent = `$${product.price}`;
            })
            .catch(error => console.error('Error fetching product:', error));
    }

    // Scroll to top button functionality
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    scrollToTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Dark/Light mode toggle
    const toggleMode = document.getElementById('toggle-mode');
    toggleMode.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
    });
});
