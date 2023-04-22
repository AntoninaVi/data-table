// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { getFirestore, orderBy, query, setDoc, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-firestore.js";


// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDi4TutTz0vVYqkV3NCWqADIOf-JGQ-R00",
    authDomain: "data-table-fd59e.firebaseapp.com",
    projectId: "data-table-fd59e",
    storageBucket: "data-table-fd59e.appspot.com",
    messagingSenderId: "777360764102",
    appId: "1:777360764102:web:9f657c7341f5f96bae7bc7"
};


initializeApp(firebaseConfig);

const db = getFirestore();
const usersRef = collection(db, 'users');


// addDoc(usersRef, {
//     email: 'example@email.com',
//     name: 'Alina Kohl',
//     userStatus: 'Active',
//     lastLoginDate: new Date(),
//     paymentStatus: 'Overdue',
//     paymentDate: new Date(),
//     paymentAmount: 500
// })
//     .then((docRef) => {
//         console.log('Document written ', docRef.id);
//     })
//     .catch((error) => {
//         console.error('Error adding document: ', error);
//     });


const userTableBody = document.getElementById('main__table-content');

// get collection "users"
getDocs(usersRef)
    .then((snapshot) => {

        snapshot.docs.forEach((doc) => {

            const userData = doc.data();
            const tr = document.createElement('tr');


            const checkboxTd = document.createElement('td');
            checkboxTd.innerHTML = '<input type="checkbox" name="" id="">';

            const imgTd = document.createElement('td');
            imgTd.innerHTML = '<img src="" alt="">';

            const nameTd = document.createElement('td');
            nameTd.className = 'table-name';
            nameTd.textContent = userData.name;

            const emailTd = document.createElement('td');
            emailTd.className = 'table-email';
            emailTd.textContent = userData.email;


            const userStatusTd = document.createElement('td');
            userStatusTd.className = 'table-status';
            userStatusTd.textContent = userData.userStatus;

            const paymentStatusTd = document.createElement('td');
            paymentStatusTd.className = 'table-payment';
            paymentStatusTd.textContent = userData.paymentStatus;

            const userLastLogin = document.createElement('td');
            userLastLogin.className = 'table-last-login';
            userLastLogin.textContent = userData.userLastLogin;

            const amountTd = document.createElement('td');
            amountTd.className = 'table-amount';
            amountTd.textContent = `$${userData.paymentAmount}`;

            const viewMoreTd = document.createElement('td');
            viewMoreTd.className = 'table-more';
            viewMoreTd.innerHTML = '<button>View More</button>';

            const menuDotsTd = document.createElement('td');
            menuDotsTd.className = 'table-menu-dots';
            menuDotsTd.innerHTML = '<button class="table-menu-dots-button">Dots</button>';

            tr.appendChild(checkboxTd);
            tr.appendChild(imgTd);
            tr.appendChild(nameTd);
            tr.appendChild(emailTd);
            tr.appendChild(userStatusTd);
            tr.appendChild(paymentStatusTd);
            tr.appendChild(userLastLogin);
            tr.appendChild(amountTd);
            tr.appendChild(viewMoreTd);
            tr.appendChild(menuDotsTd);
            userTableBody.appendChild(tr);

        })
        displayRows(tableRows, currentPage, rowsPerPage);
    });





const tableBody = document.getElementById('main__table-content');
const tableRows = tableBody.getElementsByTagName('tr');

const rowsPerPageDropdown = document.querySelector('.footer-dropdown');
const rowsPerPageOptions = [10, 20, 30];
const rowsPerPageText = document.querySelector('.footer__text:first-child');///
const rowsPerPageTotal = document.querySelector('.footer__text:last-child');///

const backButton = document.querySelector('.footer__button-arrow-forward');
const forwardButton = document.querySelector('.footer__button-arrow');
let currentPage = 1;
let rowsPerPage = 10;

// to show amount of strings
function displayRows(rows, page, perPage) {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    for (let i = 0; i < rows.length; i++) {
        if (i < start || i >= end) {
            rows[i].style.display = 'none';
        } else {
            rows[i].style.display = '';
        }
    }
}

function updateFooterText() {
    const start = (currentPage - 1) * rowsPerPage + 1;
    const end = Math.min(start + rowsPerPage - 1, tableRows.length);

    if (rowsPerPageText) {
        rowsPerPageText.textContent = `Rows per page: ${rowsPerPage}`;
    }

    if (rowsPerPageTotal) {
        rowsPerPageTotal.textContent = `${start}-${end} of ${tableRows.length}`;
    }
}

// 
function updateTable() {
    const tableBody = document.getElementById('main__table-content');
    const tableRows = tableBody.getElementsByTagName('tr');
    displayRows(tableRows, currentPage, rowsPerPage);
    updateFooterText();
}

//dropdown
rowsPerPageDropdown.addEventListener('click', () => {
    const dropdownMenu = rowsPerPageDropdown.nextElementSibling;
    dropdownMenu.innerHTML = '';
    rowsPerPageOptions.forEach(option => {
        const listItem = document.createElement('option');
        listItem.textContent = option;
        listItem.addEventListener('click', () => {
            rowsPerPage = option;
            currentPage = 1;
            updateTable();
        });
        dropdownMenu.appendChild(listItem);
    });
});

backButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        updateTable();
    }
});

forwardButton.addEventListener('click', () => {
    if (currentPage < Math.ceil(tableRows.length / rowsPerPage)) {
        currentPage++;
        updateTable();
    }
});
updateTable();



//Tabs filter
const tabs = document.querySelectorAll('.tab');

tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        const status = tab.textContent.toLowerCase();
        for (let i = 0; i < tableRows.length; i++) {
            const paymentStatus = tableRows[i].querySelector('.table-payment').textContent.toLowerCase();
            if (status === 'all' || paymentStatus === status) {
                tableRows[i].style.display = '';
            } else {
                tableRows[i].style.display = 'none';
            }
        }
        currentPage = 1;
        updateFooterText();
    });
});


//Search input
const searchInput = document.querySelector('.main__search input');

searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const searchTerm = event.target.value.toLowerCase();
        const rows = Array.from(tableRows);
        rows.forEach(row => {
            if (row.textContent.toLowerCase().includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
        currentPage = 1;
        updateFooterText();
    }
});

//Total amount of paid
const totalAmountPayment = document.querySelector('.payment__description span');

let total = 0;
getDocs(usersRef).then((snapshot) => {
    snapshot.docs.forEach((doc) => {
        const userData = doc.data();
        if (userData.paymentStatus === "Paid") {
            total += userData.paymentAmount;
        }
    });
    console.log(total);
    totalAmountPayment.textContent = total;
});


//Filter
const filterButton = document.querySelector('.filter-button');
const sortRadioButtons = document.querySelectorAll('[name="sort"]');
const usersRadioButtons = document.querySelectorAll('[name="users"]');

// selected sort and users radio buttons
function getSelectedSort() {
    return Array.from(sortRadioButtons).find(radio => radio.checked).value;
}

function getSelectedUsers() {
    return Array.from(usersRadioButtons).find(radio => radio.checked).value;
}

// Filter table rows 
function filterTableRows() {
    const selectedSort = getSelectedSort();
    const selectedUsers = getSelectedUsers();

    const filteredRows = Array.from(tableRows)
        .filter(row => {
            const userStatus = row.querySelector('.table-status').textContent;
            if (selectedUsers === 'active') {
                return userStatus.toLowerCase() === 'active';
            } else if (selectedUsers === 'inactive') {
                return userStatus.toLowerCase() === 'inactive';
            }
            return true; // selectedUsers === 'all'
        })
        .sort((row1, row2) => {
            let value1, value2;
            switch (selectedSort) {
                case 'firstName':
                    value1 = row1.querySelector('.table-name').textContent;
                    value2 = row2.querySelector('.table-name').textContent;
                    break;
                case 'lastName':
                    value1 = row1.querySelector('.table-name').textContent.split(' ')[1];
                    value2 = row2.querySelector('.table-name').textContent.split(' ')[1];
                    break;
                // case 'dueDate':
                //     value1 = new Date(row1.querySelector('.table-due-date').textContent);
                //     value2 = new Date(row2.querySelector('.table-due-date').textContent);/// to fix 
                //     break;
                // case 'lastLogin':
                //     value1 = new Date(row1.querySelector('.table-last-login').textContent);
                //     value2 = new Date(row2.querySelector('.table-last-login').textContent);
                //     break;
                default:
                    return 0; // selectedSort === 'default'
            }
            if (value1 < value2) {
                return -1;
            } else if (value1 > value2) {
                return 1;
            } else {
                return 0;
            }
        });

    return filteredRows;
}

// Update table body with filtered rows
function updateTableBody(filteredRows) {
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
    filteredRows.forEach(row => {
        tableBody.appendChild(row);
    });
}
// Handle filter button click event
filterButton.addEventListener('click', () => {
    const filteredRows = filterTableRows();
    updateTableBody(filteredRows);
});


//Menu dots

const menuDotsButton = document.querySelector('.table-menu-dots-button');

const dropdownMenu = document.querySelector('.table-menu-dots-dropdown');


menuDotsButton.addEventListener('click', (event) => {

    event.preventDefault();


    dropdownMenu.style.display = "block";
});
// 
window.addEventListener('click', (event) => {
    if (!event.target.matches('.table-menu-dots-button')) {
        dropdownMenu.style.display = "none";
    }
});




const menu = document.createElement('div');
menu.classList.add('menu-dots-list');

// Edit
const editButton = document.createElement('button');
editButton.textContent = 'Edit';
editButton.classList.add('menu-dots-item');
menu.appendChild(editButton);

// View Profile
const viewProfileButton = document.createElement('button');
viewProfileButton.textContent = 'View Profile';
viewProfileButton.classList.add('menu-dots-item');
menu.appendChild(viewProfileButton);

// Activate User
const activateUserButton = document.createElement('button');
activateUserButton.textContent = 'Activate User';
activateUserButton.classList.add('activate-user-menu-item');
menu.appendChild(activateUserButton);

// Delete
const deleteButton = document.createElement('button');
deleteButton.textContent = 'Delete';
deleteButton.classList.add('menu-dots-item');
menu.appendChild(deleteButton);

// dots Button
tableBody.addEventListener('click', function (event) {
    const targetRow = event.target.closest('tr');
    const menuDotsTd = targetRow.querySelector('.table-menu-dots');

    if (event.target.classList.contains('table-menu-dots-button') && menuDotsTd.contains(menu)) {
        // Close menu
        menuDotsTd.removeChild(menu);
    } else {
        // Open menu
        menuDotsTd.appendChild(menu);
    }
});


activateUserButton.addEventListener('click', function () {
    const targetRow = event.target.closest('tr');
    const userStatus = targetRow.querySelector('.table-status');

    if (userStatus.textContent === 'Inactive') {
        userStatus.textContent = 'Active';
    } else {
        userStatus.textContent = 'Inactive';
    }
});
