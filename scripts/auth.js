import { getInfo, saveDataLS } from "../service/service.js"

const form = document.querySelector(".login__block")
const inpLogin = document.querySelector(".login__block #form-login")
const inpPassword = document.querySelector(".login__block #form-password")
const formMessage = document.querySelector(".login__block p")
const formBtn = document.querySelector(".login__block button")

form.addEventListener("submit", (event) => {
    event.preventDefault()

    formBtn.innerHTML = "Загрузка..."
    formBtn.disabled = true

    getInfo("admin", "moderators").then(data => {
        if (data && data.length > 0) {
            let currUser = data.find(el => (inpLogin.value === el.login && inpPassword.value === el.password))
            if (currUser) {
                saveDataLS("zdrxt-user", currUser)
                location.pathname = "/pages/products.html"
                formMessage.innerHTML = ""
            } else {
                formBtn.disabled = false
                formBtn.innerHTML = "Login"
                formMessage.innerHTML = "Не вірний логін або пароль."
                setTimeout(() => {
                    formMessage.innerHTML = ""
                }, 2500)
            }
        }
    })
})