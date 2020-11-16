const myRequest = new Request("./tinh_tp.json");

window.onload = function () {
  test();
  showProduct();
  let city = document.getElementById("inputCity");
  let district = document.getElementById("inputDistrict");
  city.addEventListener("change", function () {
    showDistrict(city.value);
  });
  district.addEventListener("change", function () {
    showCommune(city.value);
  });
  //   fetch(myRequest)
  //     .then((res) => res.json())
  //     .then((data) => console.log(data));
  readTextFile("./tinh_tp.json", function (text) {
    let data = JSON.parse(text);
    let arrayData = Object.values(data);
    showCity(arrayData);
    showDistrict(city.value);
  });
};

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

var sumPrice = (arr) => {
  return arr.reduce((total, item) => {
    return total + parseInt(item.price) * parseInt(item.number);
  }, 0);
};

function checkLength(o, n, min, max) {
  if (o.length > max || o.length < min) {
    switch (n) {
      case "rowPhone":
        document.getElementById("rowPhone").style.border = "1px solid red";
        document.getElementById("errorPhone").innerHTML =
          "Số điện thoại phải từ 10-11 số";
        break;
      case "rowName":
        document.getElementById("rowName").style.border = "1px solid red";
        document.getElementById("errorName").innerHTML =
          "Họ và tên phải từ 6-16 kí tự";
        break;
      case "rowCardNumber":
        document.getElementById("rowCardNumber").style.border = "1px solid red";
        document.getElementById("errorCardNumber").innerHTML =
          "Card Number phải từ 10-11 số";
        break;
      case "rowCardCVV":
        document.getElementById("rowCardCVV").style.border = "1px solid red";
        document.getElementById("errorCardCVV").innerHTML =
          "Card CVV phải từ 6-16 Số";
        break;
      default:
        break;
    }

    return false;
  } else {
    switch (n) {
      case "rowName":
        document.getElementById("rowName").style.border = "1px solid #ccc";
        document.getElementById("errorName").innerHTML = "";
        break;
      case "rowPhone":
        document.getElementById("rowPhone").style.border = "1px solid #ccc";
        document.getElementById("errorPhone").innerHTML = "";
        break;
      case "rowCardNumber":
        document.getElementById("rowCardNumber").style.border =
          "1px solid #ccc";
        document.getElementById("errorCardNumber").innerHTML = "";
        break;
      case "rowCardCVV":
        document.getElementById("rowCardCVV").style.border = "1px solid #ccc";
        document.getElementById("errorCardCVV").innerHTML = "";
        break;
      default:
        break;
    }
    return true;
  }
}

function test() {
  let name = document.getElementById("rowName");
  let phone = document.getElementById("rowPhone");
  let cardNumber = document.getElementById("rowCardNumber");
  let cardCVV = document.getElementById("rowCardCVV");
  let btn = document.querySelector("button.btn__check");
  function check() {
    checkLength(name.value, "rowName", 6, 16);
    checkLength(phone.value, "rowPhone", 10, 11);
    checkLength(cardCVV.value, "rowCardCVV", 6, 16);
    checkLength(cardNumber.value, "rowCardNumber", 10, 11);
  }
  btn.addEventListener("click", () => {
    check();
    xxx();
  });
  function xxx() {
    let valid =
      true &&
      checkLength(name.value, "rowName", 6, 16) &&
      checkLength(phone.value, "rowPhone", 10, 11) &&
      checkLength(cardCVV.value, "rowCardCVV", 6, 16) &&
      checkLength(cardNumber.value, "rowCardNumber", 10, 11);
    valid ? modal() : console.log("fail");
  }
}

//show products
function showProduct() {
  let cart = JSON.parse(localStorage.getItem("myCart"));
  let tbody = document.querySelector("tbody");
  if (cart) {
    tbody.innerHTML = "";
    cart.forEach((item) => {
      let element = `<tr>
                            <td>
                                <img src=${
                                  "./images/" + item.img + ".jpg"
                                } alt=${item.img}>
                            </td>
                            <td>
                                <p> ${item.name} </p>
                                <p> ${"Số lượng:" + item.number}</p>
                            </td>
                            <td> ${
                              formatNumber(parseInt(item.price)) + " đ"
                            } </td>
                        </tr>`;
      tbody.insertAdjacentHTML("beforeend", element);
    });

    let total = `<tr>
                    <td> Tổng cộng: </td>
                    <td></td>
                    <td> ${formatNumber(sumPrice(cart)) + " đ"}</td>
                </tr>`;
    tbody.insertAdjacentHTML("beforeend", total);
  } else {
    tbody.innerHTML = "Giỏ hàng trống";
  }
}

function modal() {
  let modal = document.getElementById("myModal");
  let span = document.getElementsByClassName("close")[0];
  let modalTitle = document.querySelector("h5.modal__title");
  let modalContent = document.querySelector(".modal__content");
  let agree = document.querySelector("button.btn__agree");
  let cancel = document.querySelector("button.btn__cancel");
  let name = document.getElementById("rowName");
  let city = document.getElementById("inputCity");
  let district = document.getElementById("inputDistrict");
  let commune = document.getElementById("commune");
  let phone = document.getElementById("rowPhone");
  modalTitle.innerHTML = "Xác địa chỉ giao hàng:";
  modalTitle.style.color = "#232323";
  modalContent.innerHTML =
    "<br>" +
    "Tên: " +
    name.value +
    " - " +
    phone.value +
    " - " +
    commune.options[commune.selectedIndex].text +
    " - " +
    district.options[district.selectedIndex].text +
    " - " +
    city.options[city.selectedIndex].text;
  modal.style.display = "block";
  span.onclick = function () {
    modal.style.display = "none";
  };
  cancel.onclick = function () {
    modal.style.display = "none";
  };
  agree.onclick = function () {
    modal.style.display = "none";
    //index ? deleteCart(index) : cancelCart(); ///////////////////////////// ?
  };
  window.onclick = function (event) {
    //console.log(event.target);
    if (event.target === modal) {
      //console.log(event.target);
      modal.style.display = "none";
    }
  };
}

function readTextFile(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4 && rawFile.status == "200") {
      callback(rawFile.responseText);
    }
  };
  rawFile.send(null);
}

function fetchData(id, callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callback(this.response);
    }
  };
  xhttp.open("GET", `https://nvantan2.herokuapp.com/${id}`, true);
  xhttp.send();
}

function showCity(arr) {
  let allCity = document.getElementById("inputCity");
  arr.forEach((element, index) => {
    if (index)
      item = `<option value="${element.code}"> ${element.name_with_type} </option>`;
    else
      item = `<option value="${element.code}" selected> ${element.name_with_type} </option>`;
    allCity.insertAdjacentHTML("beforeend", item);
  });
}

function showDistrict(id) {
  console.log(id);
  fetchData(id, function (arr) {
    let district = JSON.parse(arr)["quan-huyen"]; // transform json to object
    let arrayDistrict = Object.values(district); // transform to array
    let allDistrict = document.getElementById("inputDistrict");
    allDistrict.dataset.code = `${id}`;
    allDistrict.innerHTML = "";
    arrayDistrict.forEach((element, index) => {
      if (index)
        item = `<option value="${element.name}"> ${element.name_with_type} </option>`;
      else
        item = `<option value="${element.name}" selected> ${element.name_with_type} </option>`;
      allDistrict.insertAdjacentHTML("beforeend", item);
    });
    showCommune(id);
  });
}

function showCommune(id) {
  let AllDistrict = document.getElementById("inputDistrict");
  let nameDistrict = AllDistrict.options[inputDistrict.selectedIndex].text;
  fetchData(id, function (arr) {
    let district = JSON.parse(arr)["quan-huyen"]; // transform json to object
    let arrayDistrict = Object.values(district); // transform to array
    let objectCommune = arrayDistrict.filter(
      (item) => item.name_with_type === nameDistrict
    ); // filter district *** return array 1 element
    let arrayCommune = Object.values(objectCommune[0]["xa-phuong"]); // transform to array
    let commune = document.getElementById("commune");
    commune.innerHTML = "";
    arrayCommune.forEach((element, index) => {
      if (index)
        item = `<option value="${element.code}"> ${element.name_with_type} </option>`;
      else
        item = `<option value="${element.code}" selected> ${element.name_with_type} </option>`;
      commune.insertAdjacentHTML("beforeend", item);
    });
  });
}
