const btnCart = document.querySelector('.shopping-cart');
const containerCartProduct = document.querySelector('.shopping-product');

btnCart.addEventListener('click', () =>{
    containerCartProduct.classList.toggle('hidden-list')
});

const rowProduct = document.querySelector('.shopping-product-row');
const cartInfo= document.querySelector('.shopping-product-row-cart');
const productList = document.querySelector('.box');
const valueTotal = document.querySelector('.total');
const countProduct = document.querySelector('#number-product');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.shopping-product-total');
const countNumber = document.querySelector('.shopping-cart-count')
const main = document.querySelector('.box');
const pay = document.querySelector('.pay');

let allProduct = JSON.parse(localStorage.getItem('saveData')) || [];

async function showCards(){
    try {
        const response = await fetch('./cards.json');
        const data = await response.json();
        const cards = data.card;

        cards.forEach(character => {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('box');
            cardDiv.innerHTML = `
                <div>
                    <img src="${character.image}" alt="${character.product}"><hr class="m-0">
                    <div class="info position-relative">
                        <h2 class="m-0">${character.product}</h2>
                        <p class="price m-0">${character.price}<span>${character.span}</span></p>
                        <input class="qty form-control-plaintext position-absolute start-0 bottom-0 text-center fs-4 mb-3" type="number" min="1" max="99" value="1">                 
                        <button class="add-cart mb-2">Añadir al carrito</button>
                    </div>
                </div> 
              `;
            main.appendChild(cardDiv);
        });
    } catch (err) {
        return console.error(err);
    }
}
showCards()

productList.addEventListener('click', e => {
    
    if(e.target.classList.contains('add-cart')){
        const product = e.target.parentElement;
        const infoProduct = {
            quantity: parseInt(product.querySelector('input').value | 0),
            title: product.querySelector('h2').textContent,
            price: product.querySelector('p').textContent,
        };
        console.log(infoProduct)
        if(infoProduct.quantity <= 0 ){
            Swal.fire({
                icon: 'error',
                title: 'Coloca la cantidad que deseas comprar'
            })
            return 0;
        }else{
            const exist = allProduct.some(product => product.title === infoProduct.title);
       
            if(exist){
                const products = allProduct.map(product => {
                    if(product.title === infoProduct.title){

                        product.quantity = product.quantity + infoProduct.quantity;
                        return product;
                    } else{
                        return product;
                    }
                });
                allProduct = [...products];
            } else{
                allProduct = [...allProduct, infoProduct];
            }
    
            saveData();
            showHTML();
        }
    }
});
rowProduct.addEventListener('click', (e) => {

    if(e.target.classList.contains('icon-close')){
        const product = e.target.parentElement;
        const title = product.querySelector('p').textContent;
        allProduct = allProduct.filter(
            product => product.title !== title
        );

        saveData();
        showHTML();
    }
});
const showHTML = () => {

    if (!allProduct.length) {
		cartEmpty.classList.remove('hidden');
		rowProduct.classList.add('hidden');
		cartTotal.classList.add('hidden');
        countNumber.classList.add('hidden');
	} else {
		cartEmpty.classList.add('hidden');
		rowProduct.classList.remove('hidden');
		cartTotal.classList.remove('hidden');
        countNumber.classList.remove('hidden');
	}
    rowProduct.innerHTML = '';

    let total = 0;
    let totalProduct = 0;
    
    allProduct.forEach(product => {
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('shopping-product-row-cart');
        containerProduct.innerHTML = `
            <div class="shopping-product-row-cart-info">
                <div d-flex justify-content-between>
                    <svg class="qty-minus" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                    <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/>                        
                    </svg>                                 
                    <span class="quantity">${product.quantity}</span>
                    <svg class="qty-plus" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                    </svg>
                </div>
                <p class="product mb-1">${product.title}</p>
                <span class="prix">${product.price}</span>
            </div>
            <svg class="icon-close ms-1" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
            </svg>
        `;
        rowProduct.append(containerProduct);

        let minus = containerProduct.querySelector('.qty-minus');
        let plus = containerProduct.querySelector('.qty-plus');
        
        minus.addEventListener('click', () => {
            if(product.quantity !== 1){
                product.quantity--;
            }
            saveData();
            showHTML();
        });
        plus.addEventListener('click', () => {
            product.quantity++;

            saveData();
            showHTML();
        });

        total = total + parseFloat(product.quantity * product.price.slice(1));
        totalProduct = totalProduct + product.quantity;
    });
    valueTotal.innerText = `$${total.toFixed(2)}`;
    pay.addEventListener('click', () => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
          })
          
          swalWithBootstrapButtons.fire({
            title: '¿Has terminado tus compras?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, terminé mis compras!',
            cancelButtonText: 'No, aun estoy en ello!',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              swalWithBootstrapButtons.fire(
                'Tu pago ha sido exitoso!',
                '',
                'success'
              )
              allProduct = [];
              saveData();
              showHTML();
            } else if (
              result.dismiss === Swal.DismissReason.cancel
            ) {
                return 0;
            }
          })
    });
    if(totalProduct > 99){
        countProduct.innerText = '+99'
    } else{   
        countProduct.innerText = totalProduct;
    }
};
const saveData = () => {
    localStorage.setItem('saveData', JSON.stringify(allProduct));
}
showHTML();