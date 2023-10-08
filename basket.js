import productsData from './data.js'


class Product {
    constructor(id, title, price, category, image) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.category = category;
        this.image = image;
    }
}

class Basket {
    constructor() {
        this.products = [];
    }

    static HAVE_PRODUCT_MESSAGE = 'Bu məhsul səbətə əlavə olunub';

    async loadBasketCount() {
        const basketSession = await this.loadBasketFromLocalStorage();
        this.updateBasketCount(basketSession.length);
    }

    async loadBasketFromLocalStorage() {
        const basketSession = await localStorage.getItem("basket");
        return basketSession ? JSON.parse(basketSession) : [];
    }
    async loadBasketItem() {
        const basketItemContainer = document.getElementById('basket-products');
        const basketItems = await this.loadBasketFromLocalStorage();
        let html = "";
        if (basketItems.length > 0) {

            await basketItems.forEach(item => {

                html =
                    `
                            <div class="col-sm-11 m-2 product-container">
                                <div class="card mb-3" style="max-width: 540px;">
                                    <div class="row g-0">
                                        <div class="col-md-4 d-flex justify-content-center align-items-center p-2">
                                            <img src="${item.image}"
                                                class="img-fluid rounded-start" alt="...">
                                        </div>
                                        <div class="col-md-8">
                                            <div class="card-body">
                                                <h5 class="card-title">${item.title}</h5>
                                                <span class="card-text d-block mb-1">Qiymət: ${item.price} AZN</span>
                                                <span class="card-text d-block mb-1">Kateqoriya: ${item.category}</span>
                                                <span class="card-text d-block mb-1">Əlavə olunub: <small class="text-body-secondary">${item.date}</small></p>
                                                <span class="card-text d-block mb-1">Toplam: ${item.count * item.price} AZN</span>
                                                <div class="mt-2 w-100 d-flex justify-content-between align-items-center">
                                                    <div class="d-flex align-items-center">
                                                        <button data-id="${item.id}" class="btn btn-primary minus-btn">-</button>
                                                        <span  class="border border-secondary item-count ms-2 me-2">${item.count}</span>
                                                        <button data-id="${item.id}" class="btn btn-primary plus-btn">+</button>
                                                    </div>
                                                    <button data-id="${item.id}" class="btn btn-warning remove-btn">Sil</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                     `
                basketItemContainer.innerHTML += html;
            })
        } else {
            html = `
               <div>
                    <div class="alert alert-warning" role="alert">
                        Səbətdə məhsul yoxdur !
                    </div>
               </div>
            `
            basketItemContainer.innerHTML += html;
        }

    }

    updateBasketCount(count) {
        const basketCount = document.getElementById('basket-count');
        basketCount.innerText = count;
    }

    formatDate(date) {
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}.${month}.${year} ${hours}:${minutes}`;
    }

    async addToBasket(productId) {
        const basketItemContainer = document.getElementById('basket-products');

        const basketSession = await this.loadBasketFromLocalStorage();
        const isProductInBasket = basketSession.some((item) => item.id === productId);

        if (!isProductInBasket) {
            basketItemContainer.innerHTML = "";
            const product = products.find((p) => p.id === productId);

            if (product) {
                const newProduct = {
                    ...product,
                    count: 1,
                    date: this.formatDate(new Date())
                };

                basketSession.push(newProduct);
                await this.saveBasketToLocalStorage(basketSession);
                await this.loadBasketItem()
                this.updateBasketCount(basketSession.length);

                return;
            }

        }

        alert(Basket.HAVE_PRODUCT_MESSAGE);
    }
    async removeToBasket(productId) {
        const basketItemContainer = document.getElementById('basket-products');
        const basketSession = await this.loadBasketFromLocalStorage();
        const removeBasketItem = basketSession.filter(product => product.id !== productId);
        if (removeBasketItem) {
            basketItemContainer.innerHTML = "";
            await this.saveBasketToLocalStorage(removeBasketItem);
            this.updateBasketCount(basketSession.length);
            return;
        }

    }

    async saveBasketToLocalStorage(basketData) {
        const convertedProduct = JSON.stringify(basketData);
        await localStorage.setItem("basket", convertedProduct);
    }
}



const products = productsData.map((data) => new Product(data.id, data.title, data.price, data.category, data.image));

const basket = new Basket();

basket.loadBasketCount();
basket.loadBasketItem();

const row = document.querySelector('.products');

products.forEach((product) => {
    let html = `
        <div class="col-sm-3 mt-5">
            <div class="card" style="width: 18rem;">
                <img src="${product.image}" class="card-img-top card-image" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">${product.category}</li>
                    <li class="list-group-item">${product.price} AZN</li>
                </ul>
                <div class="card-body">
                    <button data-id="${product.id}" class="card-link btn btn-primary">Add basket</button>
                </div>
            </div>
        </div>
    `
    row.innerHTML += html;
});

const addBtn = document.querySelectorAll('.card-link');

addBtn.forEach((btn) => {
    btn.addEventListener('click', async function () {
        let dataId = Number(this.getAttribute('data-id'));
        await basket.addToBasket(dataId);
    });
});


let basketProductContainer =document.getElementById('basket-products');

basketProductContainer.addEventListener('click',async function(e){
    e.preventDefault();
    if(e.target.className.includes("remove-btn")){
        let dataId = Number(e.target.getAttribute('data-id'));
        let productContainer = e.target.closest('.product-container');
        if (productContainer) {
            productContainer.remove();
            await basket.removeToBasket(dataId);
            await basket.loadBasketItem();
            await basket.loadBasketCount();
        }
    }
})