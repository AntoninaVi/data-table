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

// 
addDoc(usersRef, {
    email: 'example@email.com',
    name: 'Phillip Saris',
    userStatus: 'Unactive',
    lastLoginDate: new Date(),
    paymentStatus: 'Paid',
    paymentDate: new Date(),
    paymentAmount: 500
})
    .then((docRef) => {
        console.log('Document written ', docRef.id);
    })
    .catch((error) => {
        console.error('Error adding document: ', error);
    });


const userTableBody = document.getElementById('user-table-body');

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

            const amountTd = document.createElement('td');
            amountTd.className = 'table-amount';
            amountTd.textContent = `$${userData.paymentAmount}`;

            const viewMoreTd = document.createElement('td');
            viewMoreTd.className = 'table-more';
            viewMoreTd.innerHTML = '<button>View More</button>';

            const menuDotsTd = document.createElement('td');
            menuDotsTd.className = 'table-menu-dots';
            menuDotsTd.innerHTML = '<button></button>';

            tr.appendChild(checkboxTd);
            tr.appendChild(imgTd);
            tr.appendChild(nameTd);
            tr.appendChild(emailTd);
            tr.appendChild(userStatusTd);
            tr.appendChild(paymentStatusTd);
            tr.appendChild(amountTd);
            tr.appendChild(viewMoreTd);
            tr.appendChild(menuDotsTd);
            userTableBody.appendChild(tr);

        })
        displayRows(tableRows, currentPage, rowsPerPage);
    });





const tableBody = document.getElementById('user-table-body');
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
    const tableBody = document.getElementById('user-table-body');
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