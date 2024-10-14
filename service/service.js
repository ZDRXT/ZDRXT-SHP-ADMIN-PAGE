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
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ status: value })
	})
	let data = await res.json()
	return data
}

async function updateModerById(mockApi, route, id, value) {
	let url = mockApi == "public" ? PUBLIC_URL : ADMIN_URL
	let res = await fetch(url + route + "/" + id, {
		method: 'PUT',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ value })
	})
	let data = await res.json()
	return data
}


async function updateProductById(mockApi, route, id, product) {
	let url = mockApi == "public" ? PUBLIC_URL : ADMIN_URL
	let res = await fetch(url + route + "/" + id, {
		method: 'PUT',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(product)
	})
	let data = await res.json()
	return data
}

async function createData(newData, mockApi, params) {
	let url = mockApi == "public" ? PUBLIC_URL : ADMIN_URL

	let res = await fetch(url + params,{
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(newData)
	})

	let data = await res.json()
	return data
}

function getDataLS(key) {
	let data = localStorage.getItem(key)

	if (data) return JSON.parse(data)
	return null
}

function saveDataLS(key, data) {
	localStorage.setItem(key, JSON.stringify(data))
}

export { getInfo, deleteInfoById, updateInfoById, getDataLS, saveDataLS, updateProductById, createData, updateModerById }