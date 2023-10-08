let products = [
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
]

const chechBasketCount = async () =>{
    const basketSession = await localStorage.getItem("basket") ? JSON.parse(localStorage.getItem("basket")) : [];
    basketCount.innerText= basketSession.length;
}

chechBasketCount();

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
                    <li class="list-group-item">${product.price}</li>
                </ul>
                <div class="card-body">
                    <button data-id="${product.id}" class="card-link btn btn-primary">Add basket</button>
                </div>
            </div>
        </div>
    `
    row.innerHTML += html;
})


const addBtn = document.querySelectorAll('.card-link');

addBtn.forEach(btn => {
    btn.addEventListener('click', async function () {
        let dataId = Number(this.getAttribute('data-id'))
        const basketSession = await localStorage.getItem("basket") ? JSON.parse(localStorage.getItem("basket")) : [];
        let isProductInbasket = basketSession.some(a => a.id === dataId);

        if (!isProductInbasket) {
            let result = await products.find(p => p.id === dataId);
            let newProduct =
            {
                ...result,
                count: 1
            }
            console.log(newProduct)
            basketSession.push(newProduct);
            const convertedProduct = JSON.stringify(basketSession);
            await localStorage.setItem("basket", convertedProduct);

            chechBasketCount();

        }

    })
})