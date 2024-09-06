function logout() {
    let btn = document.querySelector("#logout-btn")

    if (btn) {
        btn.addEventListener("click", () => {
            localStorage.removeItem("zdrxt-user")
            location.reload()
        })
    }
}

export default logout