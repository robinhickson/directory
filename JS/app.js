// global variables
let employees = [];

const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture,
email, location, phone, dob &noinfo &nat=us,gb,ie`
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modal = document.querySelector(".modal");
const modalClose = document.querySelector(".modal-close");
const modalNext = document.querySelector(".modal-next");
const modalPrevious = document.querySelector(".modal-previous");
const employeesNames = [];
let index;


fetch(urlAPI)
    .then(res => res.json())
    .then(res => res.results)
    .then(displayEmployees)
    .catch(err => console.log(err));


function displayEmployees(employeeData) {
    employees = employeeData;
    // store the employee HTML as we create it
    let employeeHTML = '';
    // loop through each employee and create HTML markup
    employees.forEach((employee, index) => {
        let name = employee.name;
        employeesNames.push(name.first + ' ' + name.last); //Create a new array to track names only for search function       
        let email = employee.email;
        let city = employee.location.city;
        let picture = employee.picture;
        employeeHTML += `
<div class="card" id="${index}" data-index="${index}">
<img class="avatar" src="${picture.large}" />
<div class="text-container">
<h2 class="name">${name.first} ${name.last}</h2>
<p class="email">${email}</p>
<p class="address">${city}</p>
</div>
</div>
`
    });

    gridContainer.innerHTML = employeeHTML;
}


function displayModal(index) {

    let {
        name,
        dob,
        phone,
        email,
        location,
        picture
    } = employees[index];

    let date = new Date(dob.date);
    const modalHTML = `
    <img class="avatar" src="${picture.large}" />
    <div class="text-container">
<h2 class="name-modal">${name.first} ${name.last}</h2>
<p class="email">${email}</p>
<p class="address">${location.city}</p>
<p class="address">${location.country}</p>
<br/><hr/>
<p class="address">${phone}</p>
<p class="address">${location.street.number} ${location.street.name} ${location.city} ${location.postcode}</p>

<p>Birthday:
${date.getDate()}/${date.getMonth()}/${date.getFullYear()}</p>
</div>
`;
    overlay.classList.remove("hidden");
    modalContainer.innerHTML = modalHTML;


}

gridContainer.addEventListener('click', e => {

    // make sure the click is not on the gridContainer itself
    if (e.target !== gridContainer) {
        // select the card element based on its proximity to actual element
        const card = e.target.closest(".card");
        index = parseInt(card.getAttribute('data-index'));
        displayModal(index);
    }

});

modal.addEventListener('click', e => {

    if (e.target === modalClose) {
        console.log(index, typeof index);
        overlay.classList.add("hidden");
    } else if (e.target === modalNext) {
        if ((index + 1) < employees.length) {
            index += 1;
            displayModal(index);
        }
    } else if (e.target === modalPrevious) {
        if ((index - 1) >= 0)
            index -= 1;
        displayModal(index);
    }

});


///search functionality

let searchText = search.addEventListener('keyup', e => {
    let searchValue = document.getElementById('search').value.toLowerCase();
    searchKeywords(searchValue);
})


function searchKeywords(value) {
    const displayMatches = [];
    let cardsOff = document.querySelectorAll('.card');
    let container = document.querySelector('main');
    if (value !== '' && value !== undefined) {
        cardsOff.forEach(card => {
            card.style.backgroundColor = "black";
            card.style.opacity = "0.3"
        });
    } else {
        cardsOff.forEach(card => card.style.backgroundColor = "white");
    }

    // iterate through employee names to check for user input text match
    employeesNames.forEach((match, index) => {

        if (match.toLowerCase().includes(value)) {
            displayMatches.push(employees[index]);
            displayMatches.forEach(cardOn => {
                cardOn = document.getElementById(`${index}`);
                container.prepend(cardOn);
                cardOn.style.backgroundColor = "white";
                cardOn.style.opacity = "1"
            })

        }
    })

}