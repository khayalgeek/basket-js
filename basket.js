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

    updateBasketCount(count) {
        const basketCount = document.getElementById('basket-count');
        basketCount.innerText = count;
    }

    async addToBasket(productId) {
        const basketSession = await this.loadBasketFromLocalStorage();
        const isProductInBasket = basketSession.some((item) => item.id === productId);

        if (!isProductInBasket) {
            const product = products.find((p) => p.id === productId);

            if (product) {
                const newProduct = {
                    ...product,
                    count: 1,
                };

                basketSession.push(newProduct);
                await this.saveBasketToLocalStorage(basketSession);
                this.updateBasketCount(basketSession.length);
                return;
            }
           
        }
        alert(Basket.HAVE_PRODUCT_MESSAGE);
    }

    async saveBasketToLocalStorage(basketData) {
        const convertedProduct = JSON.stringify(basketData);
        await localStorage.setItem("basket", convertedProduct);
    }
}

const productsData = [
    {
        "id": 1,
        "title": "Fits 15 Laptops",
        "price": 109.95,
        "category": "men's clothing",
        "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    },
    {
        "id": 2,
        "title": "Slim Fit T-Shirts ",
        "price": 22.3,
        "category": "men's clothing",
        "image": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
    },
    {
        "id": 3,
        "title": "Mens Cotton Jacket",
        "price": 55.99,
        "category": "men's clothing",
        "image": "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    },
    {
        "id": 4,
        "title": "Mens Casual Slim Fit",
        "price": 15.99,
        "category": "men's clothing",
        "image": "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
    },
    
];

const products = productsData.map((data) => new Product(data.id, data.title, data.price, data.category, data.image));

// Sepeti başlatın
const basket = new Basket();

// Sepet sayısını yükle
basket.loadBasketCount();

// Ürünleri görüntüle
const row = document.querySelector('.products');

products.forEach((product) => {
    let html = `
        <div class="col-sm-3 mt-5">
            <div class="card" style="width: 18rem;">
                <img src="${product.image}" class="card-img-top" alt="...">
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

// Sepete ürün ekleme işlemini dinle
const addBtn = document.querySelectorAll('.card-link');

addBtn.forEach((btn) => {
    btn.addEventListener('click', function () {
        let dataId = Number(this.getAttribute('data-id'));
        basket.addToBasket(dataId);
    });
});