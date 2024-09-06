import { getInfo, deleteInfoById, updateInfoById } from "../service/service.js";

import checkUser from "../service/verif.js";
import logout from "../service/logout.js";

checkUser()
logout()

let panelContentBox = document.querySelector(".panel__content-box")

let allSelects

let ordersTitle = document.querySelector(".panel__header h1")
let searchForm = document.querySelector(".panel__header-search form")
let searchInp = document.querySelector(".panel__header-search form input")

getInfo("admin", "orders").then((data) => {
    renderOrders(data)
})

function renderOrders(data) {
    panelContentBox.innerHTML = ""
    
    let array = Array.isArray(data) ? data : [data]

    array.forEach(order => {
        let prodsHTML = ""
        
        order.products.forEach(prod => {
            prodsHTML += `<p class="order__products-item">${prod.count}x ${prod.title} [${prod.sizes.toUpperCase()}]</p>`
        })

        panelContentBox.innerHTML += `
        <div class="content-box__order">
            <h3>Order: #${order.id}</h3>
            <div class="order__top row">
                    <div class="order__client">
                        <h4>Client</h4>
                        <p>${order.client.name}</p>
                        <p>${order.client.number}</p>
                        <p>${order.client.address} - ${order.client.delivery}</p>
                    </div>

                    <div class="order__comment">
                        <h4>Comment</h4>
                        <p>${order.client.comment}</p>
                    </div>
                </div>

                <div class="order__products">
                    <h4>Products:</h4>
                    <div class="order__products-list">
                        ${prodsHTML}
                    </div>
                </div>

                <div class="order__nav" data-id="${order.id}">
                    <select class="order__nav-select" onclick="${(event) => console.log(event)}">
                        <option value="waiting-order" ${order.status == "waiting-order" ? "selected" : ""}>Waiting</option>
                        <option value="progress-order" ${order.status == "progress-order" ? "selected" : ""}>Progress</option>
                        <option value="finished-order" ${order.status == "finished-order" ? "selected" : ""}>Finished</option>
                        <option value="cancelled-order" ${order.status == "cancelled-order" ? "selected" : ""}>Cancelled</option>
                    </select>
                <button class="remove-order-btn">Remove</button>
            </div>
        </div>`
    });

    allSelects = document.querySelectorAll(".order__nav-select").forEach(select => {
        select.addEventListener("change", (event) => {
            let orderId = select.parentElement.dataset.id
            updateInfoById("admin", "orders", orderId, select.value)
        })
    }) 
}

panelContentBox.addEventListener("click", (event) => {
    let orderId = event.target.closest(".order__nav").dataset.id

    if (event.target.closest(".remove-order-btn")) {
        deleteInfoById("admin", "orders", orderId).then(() => {
            getInfo("admin", "orders").then((data) => {
                renderOrders(data)
            })
        })
    }
})

searchForm.addEventListener("submit", (event) => {
    event.preventDefault()

    getInfo("admin", "orders", `/${searchInp.value}`).then((data) => {
        if (data == "Not found") {
            panelContentBox.innerHTML = "Нічого не знайдено"
        } else {
            renderOrders(data)
            ordersTitle.innerHTML = "<span>&#11013;</span> Order #" + searchInp.value
            ordersTitle.classList.add("active")
        }
    })
})

ordersTitle.addEventListener("click", (event) => {
    if (event.target.closest("span")) {
        getInfo("admin", "orders").then((data) => {
            renderOrders(data)
        })
    
        ordersTitle.innerHTML = "All orders"
        ordersTitle.classList.remove("active")
        searchInp.value = ""
    }
})

searchInp.addEventListener("click", () => {
    searchInp.value = ""
})