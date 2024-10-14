import checkUser from "../service/verif.js";
import logout from "../service/logout.js";
import { getInfo, deleteInfoById, updateProductById, createData } from "../service/service.js";
import formatDate from "./formatDate.js";

let moderId
let cancellModalBtn = document.querySelector(".cancell-modal")
let editModalBtn = document.querySelector(".edit-modal")
let addBtn = document.querySelector("#add-btn")

let moderList = document.querySelector(".panel__content-box")

let modal = document.querySelector(".modal")
let form = document.querySelector(".modal__window form")
let cancellBtn = document.querySelector(".cancell-btn")
let doneBtn = document.querySelector(".done-btn")

let fullNameInp = document.querySelector("#fullName")
let emailInp = document.querySelector("#email")
let phoneInp = document.querySelector("#phone")
let roleListSelect = document.querySelector(".role-list__select")
let loginInp = document.querySelector("#login")
let passwordInp = document.querySelector("#password")
let moderLastLogin = document.querySelector(".modal__window-last-login")

let statusForm

checkUser()
logout()

getInfo("private", "moderators", "").then(moderArr => {
	renderModerators(moderArr)
})

function renderModerators(moderArr) {
	moderList.innerHTML = ""
	
	moderArr.forEach(moder => {
		moderList.innerHTML += `
        <div class="moderator">
		<p class="user">${moder.fullName + " (" + moder.login + ")"}</p>
        
		<div class="comment-container" data-id="${moder.id}">
		<button class="edit-moder">Edit</button>
		<button class="remove-moder">Remove</button>
		</div>
        </div>
        `
	});
}

function openModal() {
	fullNameInp.value = ""
	emailInp.value = ""
	phoneInp.value = ""
	roleListSelect.value = "Moderator"
	loginInp.value = ""
	passwordInp.value = ""
	
	modal.classList.add("active")
}

moderList.addEventListener("click", (event) => {
	let eTarget = event.target
	
	if (eTarget.closest(".remove-moder")) {
		moderId = eTarget.parentElement.dataset.id
		eTarget.innerHTML = "Loading..."
		eTarget.disabled = true
		deleteInfoById("private", "moderators", moderId).then(() => window.location.reload())
	}
	
	if (eTarget.closest(".edit-moder")) {
		moderId = eTarget.parentElement.dataset.id
		openModal()
		statusForm = "edit-moder"
		getInfo("private", `moderators/${moderId}`).then(moder => {
			if (moder) {
				fullNameInp.value = moder.fullName
				emailInp.value = moder.email
				phoneInp.value = moder.phone
				roleListSelect.value = moder.role
				loginInp.value = moder.login
				passwordInp.value = moder.password
				moderLastLogin.innerHTML = formatDate(moder["last-login"])
			}
		})
	}
})

form.addEventListener("submit", (event) => {
	event.preventDefault()
	
	let moderator = {
		fullName: fullNameInp.value,
		email: emailInp.value,
		phone: phoneInp.value,
		role: roleListSelect.value,
		login: loginInp.value,
		password: passwordInp.value,
	}

	if (statusForm === "edit-moder") {
		updateProductById("private", "moderators", moderId, moderator)
			.then(() => {
				window.location.reload()
			})
	} else {
		createData(moderator, "private", "moderators")
			.then(() => {
				window.location.reload()
			})
	}
})

addBtn.addEventListener("click", () => {
	openModal()
	statusForm = "create-prod"
})

cancellModalBtn.addEventListener("click", () => {
	modal.classList.remove("active")
})