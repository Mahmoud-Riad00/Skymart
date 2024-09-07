let products =document.querySelector('.products')
let data=[];
let x =10;
const nav = document.querySelector('.navSettings'); 
let currentIndex=0;

window. addEventListener('scroll', () => {
    let scrollTimeout;
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        if (window.scrollY > 100) {
            nav.style.width = '100vw';
            nav.style.borderRadius = '0rem';
        } else {
            nav.style.width = '';
            nav.style.borderRadius = '2rem';
        }
    }, 50);
});

async function getData(){


    let dataRes =await fetch('https://api.escuelajs.co/api/v1/products')
    data=await dataRes.json();
    let limitedData = data.length - 4
    let limitedData2 = await data.slice(0,36)
    console.log(limitedData2)

    limitedData2.forEach((product,index)=>{
        
        products.innerHTML+=

        `
        <div class="card" >
        <div class="img-container">
        <img src="${product.images[0]}">
        <p class="categInfo">${product.category.name}</p>
        </div>
        <div class="card-txt">
        <h3 class="product-name" >${product.title}</h3>
        <p>Price:${product.price}$</p>
        </div>
        </div>
        `
        
    })

}

getData();
