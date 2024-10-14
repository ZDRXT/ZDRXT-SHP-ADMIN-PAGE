import { getInfo, getDataLS, updateInfoById, updateModerById } from "./service.js";

let spinner = document.querySelector(".panel__spinner")

function checkUser() {
    let userInfo = getDataLS("zdrxt-user")
    spinner.classList.remove("spinner-disabled")

    if (userInfo && userInfo.login && userInfo.password) {
        getInfo("admin", "moderators").then((data) => {
            console.log(data)
            let currUser = data.find(el => (userInfo.login === el.login && userInfo.password === el.password))
            if (!currUser) {
                location.pathname = "/"
                localStorage.removeItem("zdrxt-user")
            } else {
                spinner.classList.add("spinner-disabled")
                updateModerById("private", "moderators", currUser.id, {...currUser, "last-login":Date.now()})
            }
        })
    } else {
        location.pathname = "/"
    }
}

export default checkUser