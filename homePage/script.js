const slidShow = document.querySelector(".sld-img");
const MainPhoto = document.querySelector(".sld-big-img");
const nav = document.querySelector('.navSettings');
const categoryDescription = document.querySelector('.category-description');
const products = document.querySelector('.products');
let data = [];
let allProducts = [];
let currentindex = 0;
let Random = [];
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


async function getData() {
    let dataRes = await fetch("https://api.escuelajs.co/api/v1/categories");
    let allProductsRes = await fetch('https://api.escuelajs.co/api/v1/products');
    allProducts = await allProductsRes.json();
    console.log(allProducts);
    data = await dataRes.json();
    const categoriesToDisplay = data.slice(0, 5);
    categoriesToDisplay.forEach((category, index) => {
        slidShow.innerHTML += `<img class="small-img" src="${category.image}" data-index="${index}">`;
    });
  allProducts.forEach((product, index) => {
        products.innerHTML += `<img class="product" src="${product.category.image}">`;
    });
    updateMainimg();
    autoSlid();
}

function updateMainimg() {
    MainPhoto.innerHTML = `<img class="big-img" src="${data[currentindex].image}">`;
    categoryDescription.innerHTML = `
    <h1>${data[currentindex].name}</h1>
    <p>${descriptions[currentindex].description}</p>
    <div class="cat-product"><a href="https://api.escuelajs.co/api/v1/categories/${data[currentindex].id}/products">Buy Now</a></div>`;
}

function autoSlid() {
    setInterval(() => {
        currentindex = (currentindex + 1) % 5;
        updateMainimg();
    }, 5000);
}

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.style.width = '110vw';
        nav.style.borderRadius = '0rem';
    } else {
        nav.style.width = '';
        nav.style.borderRadius = '2rem';
    }
});

slidShow.addEventListener('click', (event) => {
    if (event.target.classList.contains('small-img')) {
        currentindex = parseInt(event.target.getAttribute('data-index'));
        updateMainimg();
    }
});
function scrollAllProducts() {
    let scrollX = 0; // Initialize scrollX
    for (let x = 0; x < products.scrollWidth; x += 5) {
        scrollX += 50;
        products.scrollLeft = scrollX;
    }
}
scrollAllProducts();
getData();