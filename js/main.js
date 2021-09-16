var rowId = 0;
var catBreeds = [];

var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
const dbName = "petDB";

var request = indexedDB.open(dbName, 2);

request.onerror = function(event) {
  console.log("Database error");
};
request.onupgradeneeded = function(event) {
  var db = event.target.result;
  var objectStore = db.createObjectStore("pets", { keyPath: "id" });
  objectStore.createIndex("petNameInput", "petNameInput", { unique: false });
};

var request = indexedDB.open(dbName, 2);
request.onsuccess = function(event) {
	var db = event.target.result;
	var tx = db.transaction("pets");
	var objectStore = tx.objectStore("pets");
	objectStore.getAll().onsuccess = function(event) {
	  console.log(event.target.result);
	  rowId = event.target.result.length;
	  
	  
	};
	

};

document.getElementById("petclean-button").onclick = function(){

	let pet = {
		dateInput: document.getElementById("date-input").value = "",
		ownerInput: document.getElementById("owner-input").value = "",
		petNameInput: document.getElementById("petname-input").value = "",
		microchipInput: document.getElementById("microchip-input").value = "",
		petSpeciesInput: document.getElementById("petspecie-input").value,
		petSexInput: document.getElementById("petsex-input").value,
		petSizeInput: document.getElementById("petsize-input").value, 
		petPotencialInput: document.getElementById("potencialmente").value,
		petEsterilizadoInput: document.getElementById("esterilizado").value,
		petLocationInput: document.getElementById("location-input").value,
		
	};  

}



document.getElementById("petsave-button").onclick = function () {
	rowId += 1;

	let pet = {
		dateInput: document.getElementById("date-input").value,
		ownerInput: document.getElementById("owner-input").value,
		petNameInput: document.getElementById("petname-input").value,
		microchipInput: +document.getElementById("microchip-input").value,
		petSpeciesInput: document.getElementById("petspecie-input").value,
		petSexInput: document.getElementById("petsex-input").value,
		petSizeInput: document.getElementById("petsize-input").value,
		petPotencialInput: document.getElementById("potencialmente").value,
		petEsterilizadoInput: document.getElementById("esterilizado").value,
		petLocationInput: document.getElementById("location-input").value
		
	};  

    var request = indexedDB.open(dbName, 2);
 	request.onsuccess = function(event) {
    	var db = event.target.result;
    	var customerObjectStore = db.transaction("pets", "readwrite").objectStore("pets");
	    pet["id"] = rowId;
	    customerObjectStore.add(pet);
  	};

    // showing the pet record in table using DOM API

	let tr = document.createElement("tr");
	tr.setAttribute("id", "row-" + rowId);

	let tdId = document.createElement("td");
	tdId.innerHTML = rowId;
	tr.appendChild(tdId);

	Object.keys(pet).forEach((key) => {
		console.log(key);

		let td = document.createElement("td");
		td.innerHTML = pet[key];

		tr.appendChild(td);

	});

	let tdActions = document.createElement("td");
	
	let input = document.createElement("input");
	input.setAttribute("id", "delete-" + rowId);
	input.setAttribute("type", "button");
	input.value = "Eliminar";
	input.onclick = function () {
		let id = this.getAttribute("id");
		id = +id.replace("delete-", "");

		document.getElementById("row-" + id).remove();
	};

	tdActions.appendChild(input);
	
	tr.appendChild(tdActions);

	document.getElementById("body-table").appendChild(tr);

};

/*
 * Code for calling and using results from DOG and CAT APIs
 */

// Getting dog breeds

fetch('https://dog.ceo/api/breeds/list/all')
	.then(response => response.json())
	.then(data => {
				
		let petBreed = document.getElementById("dogbreed-input");

		Object.keys(data.message).map((breed) => {
			let option = document.createElement("option");
			option.innerHTML = breed;
			petBreed.appendChild(option);

		});

		// Updating select value based on cookie
		let cookies = document.cookie.split(";").map(cookie => {
			let cookieSplitted = cookie.split("=");
			let newCookie = {};
			newCookie[cookieSplitted[0]] = cookieSplitted[1];
			return newCookie;
		} );
		document.getElementById("dogbreed-input").value = cookies[0].dogBreed;

	});

document.getElementById("show-dog-image").onclick = function () {

	let breed = document.getElementById("dogbreed-input").value;

	fetch('https://dog.ceo/api/breed/' + breed + '/images/random')
		.then(response => response.json())
		.then(data => {
			document.getElementById("dog-image").setAttribute("src", data.message);
		});

};

// Getting cat breeds

fetch('https://api.thecatapi.com/v1/breeds')
	.then(response => response.json())
	.then(data => {
		catBreeds = data;

		let catBreed = document.getElementById("catbreed-input");

		data.forEach((breed) => {
			let option = document.createElement("option");
			option.innerHTML = breed.name;
			catBreed.appendChild(option);

		});

		// Updating select value based on cookie
		let myLocalStorage = window.localStorage;
		document.getElementById("catbreed-input").value = myLocalStorage.getItem("catBreed");
		
	});

document.getElementById("show-cat-image").onclick = function () {

	let breedName = document.getElementById("catbreed-input").value;

	let breedId = catBreeds.find(breed => breedName == breed.name).id;

	fetch('https://api.thecatapi.com/v1/images/search?breed_ids=' + breedId)
		.then(response => response.json())
		.then(data => {
			document.getElementById("cat-image").setAttribute("src", data[0].url);
		});

};

/*
 * Experimenting with cookies, storage and IndexedDB
 */

document.getElementById("dogbreed-input").onchange = function () {

	let dogBreed = document.getElementById("dogbreed-input").value;
	console.log(dogBreed);
	document.cookie = "dogBreed=" + dogBreed;

};

document.getElementById("catbreed-input").onchange = function () {

	let catBreed = document.getElementById("catbreed-input").value;
	console.log(catBreed);
	let myLocalStorage = window.localStorage;
	myLocalStorage.setItem('catBreed', catBreed);

};

