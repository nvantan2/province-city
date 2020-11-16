var findIndex = (products, name) => {
    var result = -1;
    products.forEach((product, index) => {
        if (product.name === name) {
            result = index;
        }
    });
    return result;
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function toCart(img, name, price, number) {
    let cart = JSON.parse(localStorage.getItem("myCart"));
    if (cart) {
        let indexProduct = findIndex(cart, name);
        if (indexProduct === -1) {
            cart = cart.concat({ img: img, name: name, price: price, number: 1 })
        }
        else {
            cart[indexProduct].number = parseInt(cart[indexProduct].number) + parseInt(number);
        }
        localStorage.setItem("myCart", JSON.stringify(cart))
    }
    else {
        let myCart = [{ img: img, name: name, price: price, number: number }];
        localStorage.setItem("myCart", JSON.stringify(myCart));
    }
}

function showCart() {
    let cart = JSON.parse(localStorage.getItem("myCart"));
    if (cart) {
        if (cart.length) {
            let tbody = document.querySelector("table tbody");
            tbody.innerHTML = "";
            cart.forEach((item, index) => {
                let element = `<tr>
                                <td> <img src=${'./images/' + item.img + '.jpg'} alt=${item.img}> </td>
                                <td> ${item.name} </td>
                                <td> ${formatNumber(parseInt(item.price)) + ' đ'} </td>
                                <td> <input type="number" value=${item.number} data-quantitys=${index} min='1'> </td>
                                <td> ${formatNumber(parseInt(item.price) * parseInt(item.number)) + ' đ'} </td>
                                <td> <button type="button" data-delete=${index} data-name='${item.name}'> <i class="fas fa-trash-alt"></i> </button> </td>
                            </tr>`
                tbody.insertAdjacentHTML('beforeend', element)
            })
            
            eventCart();
        }

        else {
            
            let show = document.querySelector("div h2.title__arrow");
            show.insertAdjacentHTML('afterend', "<p>Gio Hang Trong</p>")
            document.querySelector("div table").style.display = "none";
            document.querySelector("div div.cart_btn").style.display = "none";
        }
    }
    else {
        let show = document.querySelector("div h2.title__arrow");
        show.insertAdjacentHTML('afterend', "<p>Gio Hang Trong</p>")
        document.querySelector("div table").style.display = "none";
        document.querySelector("div div.cart_btn").style.display = "none";
    }
}

function changeCart(index, quantity) {
    if (quantity < 1) {
        showCart();
    }
    else {
        let cart = JSON.parse(localStorage.getItem("myCart"));
        cart[Number(index)].number = quantity;
        localStorage.setItem("myCart", JSON.stringify(cart));
        showCart();
    }
}

function eventCart() {
    let quantity = document.querySelectorAll("td input[type='number']");
    quantity.forEach((item) => {
        item.addEventListener("change", function () { changeCart(this.dataset.quantitys, this.value) })
    });

    let del = document.querySelectorAll("td button[type='button']");
    del.forEach(item => {
        item.addEventListener("click", function () { modal(this.dataset.name, this.dataset.delete) })
    })

    let cancel = document.querySelector(".cancelCart");
    cancel.addEventListener("click", function () { modal("Giỏ hàng", NaN) })
}

function deleteCart(index) {
    let cart = JSON.parse(localStorage.getItem("myCart"));
    cart.splice(Number(index), 1);
    localStorage.setItem("myCart", JSON.stringify(cart));
    showCart();
}

function modal(name, index) {
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
    var modalDesc = document.querySelector("p.modal__desc");
    var agree = document.querySelector("button.btn__agree");
    var cancel = document.querySelector("button.btn__cancel");
    modalDesc.innerHTML = "Bạn chắc chắn muốn xoá: " + name;
    modalDesc.style.color = "#dc3545";
    modal.style.display = "block";
    span.onclick = function () {
        modal.style.display = "none";
    }
    cancel.onclick = function () {
        modal.style.display = "none";
    }
    agree.onclick = function () {
        modal.style.display = "none";
        index ? deleteCart(index) : cancelCart();
    }
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
}

function cancelCart() {
    localStorage.removeItem("myCart");
    showCart();
}
