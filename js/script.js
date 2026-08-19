const productsContainer = document.getElementById("products-container");
const searchInput = document.getElementById("searchInput");
const categoryMenu = document.getElementById("categoryMenu");
const sortMenu = document.getElementById("sortMenu");

let allProducts = [];
let currentProducts = [];
let selectedCategory = "all";
let cart=JSON.parse(localStorage.getItem("shoppingCart"))||[];
displayCart();
updateCartCount();

fetch("https://dummyjson.com/products?limit=0")
.then(response=> {
if (!response.ok){
      throw new Error("Failed to load products");
    }
    return response.json();
  })
    .then(data => {

        allProducts = data.products;
        currentProducts = [...allProducts];

        displayProducts(currentProducts);

        const categories = [...new Set(allProducts.map(product => product.category))];

        categories.forEach(category => {

            categoryMenu.innerHTML += `
                <li>
                    <a class="dropdown-item"
                       href="#"
                       data-category="${category}">
                        ${category}
                    </a>
                </li>
            `;

        });

    })
    .catch(error => {
      productsContainer.innerHTML =  `
      <div class="alert alert-danger text-center">
      ${error.message}
      </div>
       `;
    });

searchInput.addEventListener("input", function () {

    const searchValue = searchInput.value.toLowerCase();

    let filteredProducts = allProducts;

    if (selectedCategory !== "all") {

        filteredProducts = filteredProducts.filter(product =>
            product.category === selectedCategory
        );

    }

    filteredProducts = filteredProducts.filter(product =>
        product.title.toLowerCase().includes(searchValue)
    );

    currentProducts = filteredProducts;

    displayProducts(currentProducts);

});

categoryMenu.addEventListener("click", function (e) {

    if (e.target.classList.contains("dropdown-item")) {

        e.preventDefault();

        const category = e.target.dataset.category;

        selectedCategory = category;

        if (category === "all") {

            currentProducts = [...allProducts];

        } else {

            currentProducts = allProducts.filter(product =>
                product.category === category
            );

        }

        displayProducts(currentProducts);

    }

});
sortMenu.addEventListener("click", function (e) {

    if (!e.target.classList.contains("dropdown-item")) return;

    e.preventDefault();

    const sortType = e.target.dataset.sort;

    currentProducts.sort((a, b) => {
        if (sortType === "low") {
            return a.price - b.price;
        } else {
            return b.price - a.price;
        }
    });

    displayProducts(currentProducts);

});

function displayProducts(products) {

    productsContainer.innerHTML = "";

    products.forEach(product => {

        productsContainer.innerHTML += `
        <div class="card">
            <img src="${product.thumbnail}" class="card-img-top">

            <div class="card-body d-flex flex-column">

                <h5>${product.title}</h5>

                <p><strong>$${product.price}</strong></p>

                <p>${product.category}</p>

                <p>⭐ ${product.rating}</p>

                <div class="d-flex gap-2 mt-auto">

                    <button
                        class="btn2  flex-fill"
                        onclick="showDetails(${product.id})">
                        Details
                    </button>

                    <button class="btn2 flex-fill"
             onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>

                </div>

            </div>

        </div>
        `;

    });

}

function showDetails(id) {

    fetch(`https://dummyjson.com/products/${id}`)
        .then(response => {

            if (!response.ok) {
                throw new Error("Product not found");
            }

            return response.json();

        })
        .then(product => {

            document.getElementById("modalBody").innerHTML = `
                <img src="${product.thumbnail}" class="img-fluid mb-3">

                <h3>${product.title}</h3>

                <p>${product.description}</p>

                <p><strong>Price:</strong> $${product.price}</p>

                <p><strong>Category:</strong> ${product.category}</p>

                <p><strong>Rating:</strong> ⭐ ${product.rating}</p>

                <p><strong>Brand:</strong> ${product.brand}</p>

                <p><strong>Stock:</strong> ${product.stock}</p>
            `;

            const modal = new bootstrap.Modal(
                document.getElementById("productModal")
            );

            modal.show();

        })
        .catch(error => {

            document.getElementById("modalBody").innerHTML = `
                <div class="alert alert-danger text-center">
                    ${error.message}
                </div>
            `;

            const modal = new bootstrap.Modal(
                document.getElementById("productModal")
            );

            modal.show();

        });

}
function addToCart(id){

    const product = allProducts.find(product => product.id === id);
    const existingIndex=cart.findIndex(item=>item.id===id);
    if (existingIndex > -1){
        cart[existingIndex].quantity =(cart[existingIndex].quantity||1)+1;
    } else{
        product.quantity=1;
        

    cart.push(product);
}

    localStorage.setItem("shoppingCart",JSON.stringify(cart));
    updateCartCount();


    displayCart();
}

function updateCartCount() {
    
    const totalCount=cart.reduce((sum,item)=> sum + (item.quantity ||1 ),0);
    document.getElementById("cartCount").textContent = totalCount;

}
function displayCart() {
    const cartBody = document.getElementById("cartBody");
    cartBody.innerHTML = "";

    if (cart.length === 0) {
        cartBody.innerHTML = "<p class='text-center my-3'>Your cart is empty.</p>";
        return;
    }

    let cartItemsHTML = '<div class="cart-items-list mb-3">';
    let subtotal = 0;

    cart.forEach((product, index) => {
        const itemQuantity = product.quantity || 1;
        const itemTotal = product.price * itemQuantity;
        subtotal += itemTotal;

        cartItemsHTML += `
            <div class="cart-item-row d-flex align-items-center justify-content-between border-bottom py-2 gap-2">
                <div class="d-flex align-items-center gap-2">
                    <img src="${product.thumbnail}" alt="${product.title}" class="cart-item-img">
                    <div>
                        <h6 class="cart-item-title mb-0 text-dark">${product.title}</h6>
                        <small class="cart-item-category text-muted text-uppercase">${product.category}</small>
                        <div class="d-flex align-items-center gap-2 mt-1">
    <button class="btn btn-sm btn-outline-dark cart-qty-btn" onclick="decreaseQuantity(${index})">-</button>
    <span class="fw-bold cart-qty-number">${itemQuantity}</span>
    <button class="btn btn-sm btn-outline-dark cart-qty-btn" onclick="increaseQuantity(${index})">+</button>
</div>
                    </div>
                </div>
                <div class="text-end">
                    <span class="cart-item-price fw-bold">$${itemTotal.toFixed(2)}</span>
                    <br>
                    <button class="btn btn-sm text-danger p-0 cart-remove-btn" onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        `;
    });
    cartItemsHTML += '</div>';

    let summaryHTML = `
        <div class="cart-summary border-top pt-3">
            <div class="cart-summary-row d-flex justify-content-between mb-1">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="cart-summary-row d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span class="text-success fw-bold">Free ($0.00)</span>
            </div>
            <div class="cart-total-row d-flex justify-content-between mb-3 border-top pt-2 fw-bold">
                <span>Total</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <button class="btn btn-dark w-100 py-2 fw-bold" onclick="placeOrder()">Place Order</button>
        </div>
    `;

    cartBody.innerHTML = cartItemsHTML + summaryHTML;
}
function increaseQuantity(index){
    cart[index].quantity=(cart[index].quantity||1)+1;
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
    updateCartCount();
    displayCart();
}
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
    updateCartCount();
    displayCart();
}
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("shoppingCart",JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

function placeOrder() {
    alert("Order placed successfully! Thank you for your purchase.");
    cart = [];
    localStorage.removeItem("shoppingCart");
    updateCartCount();
    displayCart();
    

    const cartModalEl = document.getElementById('cartModal');
    const modalInstance = bootstrap.Modal.getInstance(cartModalEl);
    if (modalInstance) {
        modalInstance.hide();
    }
}