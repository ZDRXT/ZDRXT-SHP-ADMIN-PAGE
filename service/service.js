import { PUBLIC_URL, ADMIN_URL } from "./key.js";

async function getInfo(mockApi, route, param = "") {
    let url = mockApi == "public" ? PUBLIC_URL : ADMIN_URL 
	let res = await fetch(url + route + param)
	let data = await res.json()
	return data
}

async function deleteInfoById(mockApi, route, id) {
	let url = mockApi == "public" ? PUBLIC_URL : ADMIN_URL 
	let res = await fetch(url + route + "/" + id, {
		method: 'DELETE',
	  })
	let data = await res.json()
	return data
}

async function updateInfoById(mockApi, route, id, value) {
	let url = mockApi == "public" ? PUBLIC_URL : ADMIN_URL 
	let res = await fetch(url + route + "/" + id, {
		method: 'PUT', 
		headers: {'content-type':'application/json'},
		body: JSON.stringify({status: value})
	  })
	let data = await res.json()
	return data
}

export { getInfo, deleteInfoById, updateInfoById }