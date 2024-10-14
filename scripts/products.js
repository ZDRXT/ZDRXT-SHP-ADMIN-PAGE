import checkUser from "../service/verif.js";
import logout from "../service/logout.js";
import { getInfo, deleteInfoById, updateProductById, createData } from "../service/service.js";
import formatDate from "./formatDate.js";

checkUser()
logout()

let modal = document.querySelector(".modal")
let form = document.querySelector(".modal__window form")
let cancellBtn = document.querySelector(".cancell-btn")
let doneBtn = document.querySelector(".done-btn")
let titleInp = document.querySelector(".modal__window-title input")
let descriptionInp = document.querySelector(".modal__window-description input")
let imgsInp = document.querySelectorAll(".imgs input")
let categoriesListSel = document.querySelector(".categories-list__select")
let fullPriceInp = document.querySelector(".full-price-inp")
let discPriceInp = document.querySelector(".disc-price-inp")
let discPricePercentInp = document.querySelector(".price-discount-percent__input")
let totalPrice = document.querySelector(".price-total input")
let discountOffBtn = document.querySelector("#discount-off")
let discountOnBtn = document.querySelector("#discount-on")
let modalProdDate = document.querySelector(".modal-prod__date")
let addBtn = document.querySelector("#add-btn")
let statusForm
let currProdId

let searchProductForm = document.querySelector("#search-product")
let searchProductInp = document.querySelector(".search-product__inp")

let searchIdForm = document.querySelector("#search-id")
let searchIdInp = document.querySelector(".search-id__inp")

let filterText = document.querySelector(".panel__content h1")

const prodList = document.querySelector(".panel__content-box")

getInfo("public", "products").then(data => {
	if (data) {
		renderProducts(data)
	}
})

function renderProducts(prodArr) {
	prodList.innerHTML = ""

	prodArr.forEach(prod => {
		prodList.innerHTML += `
            <div class="content-box__product row">
                <div class="product__gallery row">
                    <img src="${prod.photos[0]}"
                        class="product__gallery-main">

                    <div class="product__gallery-other row">
                        <img src="${prod.photos[1]}">

                        <img src="${prod.photos[2]}">
                    </div>
                </div>

                <div class="product__info">
                    <h3 class="product__info-title">${prod.title}</h3>

                    <p class="product__info-descr">${prod.about}</p>

                    <div class="product__info-sizes row">
                        [ ${prod.sizes.join(", ").toUpperCase()} ]
                    </div>

                    <div class="row">
                        <div class="product__info-discount">$${prod.isDiscount ? (prod.price - (prod.price * prod.discount / 100)).toFixed(2) : prod.price}</div>

                        <div class="product__info-price">${prod.isDiscount ? prod.price : ""}</div>
                    </div>
                </div>

                <div class="product__control" data-id=${prod.id}>
                    <button class="product__control-edit">Edit</button>

                    <button class="product__control-remove">Remove</button>
                </div>
            </div>
        `
	});
}

prodList.addEventListener("click", (event) => {
	let eTarget = event.target
	let prodId

	if (eTarget.closest(".product__control-edit")) {
		statusForm = "edit-prod"
		prodId = eTarget.parentElement.dataset.id
		openModal()
		getInfo("public", `products/${prodId}`).then(prod => {
			if (prod) {
				titleInp.value = prod.title
				descriptionInp.value = prod.about
				imgsInp[0].value = prod.photos[0]
				imgsInp[1].value = prod.photos[1]
				imgsInp[2].value = prod.photos[2]
				fullPriceInp.value = prod.price
				discPricePercentInp.value = prod.discount
				categoriesListSel.value = prod.category
				currProdId = prodId
				if (prod.isDiscount) {
					discountOnBtn.checked = true
					discountOffBtn.checked = false
				} else {
					discountOnBtn.checked = false
					discountOffBtn.checked = true
				}
				discPriceInp.value = +(fullPriceInp.value * discPricePercentInp.value / 100).toFixed(2)
				totalPrice.value = fullPriceInp.value - discPriceInp.value
				modalProdDate.innerHTML = formatDate(prod.createdAt)
			}
		})
	}

	if (eTarget.closest(".product__control-remove")) {
		prodId = eTarget.parentElement.dataset.id
		eTarget.innerHTML = "Loading..."
		eTarget.disabled = true
		deleteInfoById("public", "products", prodId).then(() => window.location.reload())
	}
})

form.addEventListener("submit", (event) => {
	event.preventDefault()

	let product = {
		title: titleInp.value,
		price: fullPriceInp.value,
		about: descriptionInp.value,
		discount: discPricePercentInp.value,
		category: categoriesListSel.value,
		photos: [
			imgsInp[0].value,
			imgsInp[1].value,
			imgsInp[2].value
		],
		isDiscount: discountOnBtn.checked
	}

	if (statusForm === "edit-prod") {
		updateProductById("public", "products", currProdId, product)
			.then(() => {
				window.location.reload()
			})
	} else {
		createData(product, "public", "products")
			.then(() => {
				window.location.reload()
			})
	}
})

cancellBtn.addEventListener("click", () => {
	modal.classList.remove("active")
})

discPriceInp.addEventListener("input", () => {
	discPricePercentInp.value = +(discPriceInp.value * 100 / fullPriceInp.value).toFixed(2)
	totalPrice.value = fullPriceInp.value - discPriceInp.value
})

discPricePercentInp.addEventListener("input", () => {
	discPriceInp.value = +(fullPriceInp.value * discPricePercentInp.value / 100).toFixed(2)
	totalPrice.value = fullPriceInp.value - discPriceInp.value
})

function openModal() {
	titleInp.value = ""
	descriptionInp.value = ""
	imgsInp[0].value = ""
	imgsInp[1].value = ""
	imgsInp[2].value = ""
	fullPriceInp.value = ""
	discPricePercentInp.value = ""
	categoriesListSel.value = ""
	currProdId = ""
	discountOnBtn.checked = false
	discountOffBtn.checked = true
	discPriceInp.value = ""
	totalPrice.value = ""
	modalProdDate.innerHTML = formatDate(Date.now())
	modal.classList.add("active")
}

addBtn.addEventListener("click", () => {
	openModal()
	statusForm = "create-prod"
})

searchProductForm.addEventListener("submit", (event) => {
	event.preventDefault()

	getInfo("public", "products", "")
		.then((data) => {
			const searchResult = data.filter(element => element.title.includes(searchProductInp.value))
			renderProducts(searchResult)
			filterText.innerHTML = "<span>⬅</span> Filter by title"
		})
})

searchIdForm.addEventListener("submit", (event) => {
	event.preventDefault()

	getInfo("public", "products", "")
		.then((data) => {
			const searchResult = data.filter(element => element.id.includes(searchIdInp.value))
			renderProducts(searchResult)
			filterText.innerHTML = "<span>⬅</span> Filter by id"
		})
})

filterText.addEventListener("click", (event) => {
	if (event.target.closest("span")) {
		filterText.innerHTML = "All products"
		searchProductInp.value = ""
		searchIdInp.value = ""

		getInfo("public", "products").then(data => {
			if (data) {
				renderProducts(data)
			}
		})
	}
})

