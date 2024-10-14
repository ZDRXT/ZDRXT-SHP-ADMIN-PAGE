import checkUser from "../service/verif.js";
import logout from "../service/logout.js";
import formatDate from "./formatDate.js";
import { getInfo, deleteInfoById } from "../service/service.js";

checkUser()
logout()

let searchIdForm = document.querySelector("#search-id")
let searchIdInp = document.querySelector(".search-id__inp")
let filterText = document.querySelector(".panel__header h1")

const commentList = document.querySelector(".panel__content-box")

getInfo("public", "Comments", "")
    .then((data) => {
        renderComments(data)

    })

function renderComments(commentArr) {
    commentList.innerHTML = ""

    commentArr.forEach(comment => {
        commentList.innerHTML += `
            <div class="comment">
                <p>${comment.text}</p>

                <div class="comment-container">
                    <div class="comment-info">
                        <h3 class="comment-info__date">${formatDate(comment.date)}</h3>
    
                        <div class="comment-info__container">
                            <h3 class="reccomendation">${comment.reccomended ? "Positive" : "Negative"}</h3>
    
                            <h3 class="comment-info__comment-id">ID: ${comment.id}</h3>
    
                            <h3 class="comment-info__prod-id">Prod ID: ${comment.productId}</h3>
                        </div>
                    </div>
                                    
                    <button class="remove-comment" data-id=${comment.id}>Remove</button>
                </div>
            </div>
        `
    })
}

commentList.addEventListener("click", (event) => {
    let eTarget = event.target
    let commentId



    if (eTarget.closest(".remove-comment")) {
        commentId = eTarget.dataset.id
        eTarget.innerHTML = "Loading..."
        eTarget.disabled = true
        deleteInfoById("public", "Comments", commentId).then(res => {
            console.log(res)
            if (res.ok) {
                console.log( res.json())
            }
            // handle error
        }).then(task => {
            // Do something with deleted task
        }).catch(error => {
            // handle error
        })
        // .then(() => window.location.reload())
    }
})

searchIdForm.addEventListener("submit", (event) => {
	event.preventDefault()

	getInfo("public", "Comments", "")
		.then((data) => {
			const searchResult = data.filter(element => element.id.includes(searchIdInp.value))
			renderComments(searchResult)
			filterText.innerHTML = "<span>⬅</span> Filter by id"
		})
})

filterText.addEventListener("click", (event) => {
	if (event.target.closest("span")) {
		filterText.innerHTML = "All products"
		searchIdInp.value = ""

		getInfo("public", "Comments").then(data => {
			if (data) {
				renderComments(data)
			}
		})
	}
})