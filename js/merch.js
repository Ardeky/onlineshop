const btnCart = document.querySelector('.shopping-cart');
const containerCartProduct = document.querySelector('.shopping-product');

btnCart.addEventListener('click', () =>{
    containerCartProduct.classList.toogle('hidden')
});

const rowProduct = document.querySelector('.shopping-product-row');
const cartInfo= document.querySelector('.shopping-product-row-cart');
const productList = document.querySelector('.box');
const valueTotal = document.querySelector('.total');
const countProduct = document.querySelector('#number-product')

let allProduct = [];

productList.addEventListener('click', e => {
    if(e.target.classList.contains('add-cart')){
        const product = e.target.parentElement;
        const infoProduct = {
            quantity: 1,
            title: product.querySelector('h2').textContent,
            price: product.querySelector('p').textContent,
        };

        const exist = allProduct.some(product => product.title === infoProduct.title);
        if(exist){
            const products = allProduct.map(product => {
                if(product.title === infoProduct.title){
                    product.quantity++;
                    return product;
                } else{
                    return product;
                }
            });
            allProduct = [...products];
        } else{
            allProduct = [...allProduct, infoProduct];
        }

        showHTML();
    }
});
const showHTML = () => {
    rowProduct.innerHTML= '';

    let total = 0;
    let totalProduct = 0;

    allProduct.forEach(product => {
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('shopping-product-row-cart');
        containerProduct.innerHTML = `
            <div class="shopping-product-row-cart-info">
                <span class="quantity">${product.quantity}</span>
                <p class="product mb-0">${product.title}</p>
                <span class="prix">${product.price}</span>
            </div>
            <svg class="icon-close" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
            </svg>
        `;
        rowProduct.append(containerProduct);
        total = total + parseFloat(product.quantity * product.price.slice(1));
        totalProduct = totalProduct + product.quantity;
    });
    valueTotal.innerText = `$${total.toFixed(2)}`;
    countProduct.innerText = totalProduct;
    console.log(valueTotal, countProduct);
};