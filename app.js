// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { getFirestore, orderBy, query, setDoc, collection, getDocs, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-firestore.js";
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

//Add data
// addDoc(usersRef, {
//     email: 'example@email.com',
//     name: 'Phillip Saris',
//     userStatus: 'Inactive',
//     lastLoginDate: new Date().toDateString(),
//     paymentStatus: 'Overdue',
//     paymentDate: new Date().toDateString(),
//     paymentAmount: 100,
//     userActivity: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies.',
//     userDetail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Rhoncus, sed purus eu semper morbi id nunc, adipiscing vitae. Ultricies suspendisse vestibulum.'
// })
//     .then((docRef) => {
//         console.log('User has been added', docRef.id);
//     })
//     .catch((error) => {
//         console.error('Error adding user: ', error);
//     });


const userTableBody = document.getElementById('main__table-content');

const tableBody = document.getElementById('main__table-content');
const tableRows = tableBody.getElementsByTagName('tr');

const rowsPerPageDropdown = document.querySelector('.footer-dropdown');
const rowsPerPageOptions = [10, 20, 30];
const rowsPerPageText = document.querySelector('.footer__text-pages');///
const rowsPerPageTotal = document.querySelector('.footer__text');///

const backButton = document.querySelector('.footer__button-arrow-forward');
const forwardButton = document.querySelector('.footer__button-arrow');
let currentPage = 1;
let rowsPerPage = 10;

// get collection "users"
getDocs(usersRef)

    .then((snapshot) => {
        snapshot.docs.forEach((doc) => {

            const userData = doc.data();
            const tr = document.createElement('tr');
            tr.className = 'user-data-table'

            const rowContent = document.createElement('div');
            rowContent.className = 'user-data-table-content'

            const checkboxTd = document.createElement('td');
            checkboxTd.innerHTML = '<input type="checkbox" name="" id="">';

            const buttonTd = document.createElement('td');
            buttonTd.className = 'table-button'
            buttonTd.innerHTML = '<button class="table-button-arrow"><img class="table-button-arrow-img" src="img/arrow.svg" alt="arrow"></button> ';
            buttonTd.addEventListener('click', toggleTableUserInfo);

            const nameTd = document.createElement('td');
            nameTd.className = 'table-name';
            nameTd.textContent = userData.name;

            const emailTd = document.createElement('td');
            emailTd.className = 'table-email';
            emailTd.textContent = userData.email;

            const nameEmailDiv = document.createElement('div');
            nameEmailDiv.className = 'name-email-group';
            nameEmailDiv.appendChild(nameTd);
            nameEmailDiv.appendChild(emailTd);

            const userStatusTd = document.createElement('td');
            userStatusTd.className = 'table-status';
            userStatusTd.textContent = userData.userStatus;
            if (userStatusTd.textContent === 'Inactive') {
                userStatusTd.style.color = '#6E6893';
                userStatusTd.style.background = '#F2F0F9';
            }

            const userLastLogin = document.createElement('td');
            userLastLogin.className = 'table-last-login';
            userLastLogin.textContent = userData.lastLoginDate;

            const statusLastLoginDiv = document.createElement('div');
            statusLastLoginDiv.className = 'status-last-login-group';
            statusLastLoginDiv.appendChild(userStatusTd);
            statusLastLoginDiv.appendChild(userLastLogin);

            const paymentStatusTd = document.createElement('td');
            paymentStatusTd.className = 'table-payment';
            paymentStatusTd.textContent = userData.paymentStatus;
            if (paymentStatusTd.textContent === 'Unpaid') {
                paymentStatusTd.style.color = '#965E00';
                paymentStatusTd.style.backgroundColor = '#FFECCC';
            } else if (paymentStatusTd.textContent === 'Overdue') {
                paymentStatusTd.style.color = '#D30000';
                paymentStatusTd.style.backgroundColor = '#FFE0E0';
            }

            const paymentDateTd = document.createElement('td');
            paymentDateTd.className = 'payment-date';
            paymentDateTd.textContent = userData.paymentDate;

            const paymentGroupDiv = document.createElement('div');
            paymentGroupDiv.className = 'payment-group';
            paymentGroupDiv.appendChild(paymentStatusTd);
            paymentGroupDiv.appendChild(paymentDateTd);

            const amountTd = document.createElement('td');
            amountTd.className = 'table-amount';
            amountTd.textContent = `$${userData.paymentAmount}`;

            const usdText = document.createElement('div');
            usdText.className = 'usd-text';
            usdText.textContent = 'usd';

            const amountGroupDiv = document.createElement('div');
            amountGroupDiv.className = 'amount-group';
            amountGroupDiv.appendChild(amountTd);
            amountGroupDiv.appendChild(usdText);

            const viewMoreTd = document.createElement('td');
            viewMoreTd.className = 'table-more';
            viewMoreTd.innerHTML = '<button class="table-more-button">View More</button>';

            const menuDotsTd = document.createElement('td');
            menuDotsTd.className = 'table-menu-dots';
            menuDotsTd.innerHTML = '<button class="table-menu-dots-button"></button>';

            rowContent.appendChild(checkboxTd);
            rowContent.appendChild(buttonTd);
            rowContent.appendChild(nameEmailDiv);
            rowContent.appendChild(statusLastLoginDiv);
            rowContent.appendChild(paymentGroupDiv);
            rowContent.appendChild(amountGroupDiv);
            rowContent.appendChild(viewMoreTd);
            rowContent.appendChild(menuDotsTd);
            tr.appendChild(rowContent)
            userTableBody.appendChild(tr);
        })

        displayRows(tableRows, currentPage, rowsPerPage);


        //Menu dots
        tableBody.addEventListener('click', function (event) {
            const targetRow = event.target.closest('tr');
            const menuDotsTd = targetRow.querySelector('.table-menu-dots');
            const menu = targetRow.querySelector('.table-menu-dots-dropdown');

            if (event.target.classList.contains('table-menu-dots-button') && menu) {
                // Close menu
                menu.remove();
            } else if (menu) {
                // Menu already exists
                menu.remove();
                menuDotsTd.appendChild(menu);
            } else {
                // Open menu
                const newMenu = document.createElement('div');
                newMenu.classList.add('table-menu-dots-dropdown');
                menuDotsTd.appendChild(newMenu);
                addButtonsToDropdownMenus();
            }
            window.addEventListener('click', (event) => {
                if (!event.target.matches('.table-menu-dots-button')) {
                    const dropdownMenu = document.querySelector('.table-menu-dots-dropdown');
                    if (dropdownMenu) {
                        dropdownMenu.remove();
                    }
                }
            });
        });
    });

//Dropdown menu list in three dots
function addButtonsToDropdownMenus() {
    const dropdownMenus = document.querySelectorAll('.table-menu-dots-dropdown');

    dropdownMenus.forEach(menu => {
        const menuList = document.createElement('div')
        menuList.classList.add('menu-dots-list');
        menu.appendChild(menuList);

        const closeButton = document.createElement('button')
        closeButton.classList.add('menu-dots-list-close')
        menuList.appendChild(closeButton)

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('menu-dots-item');
        menuList.appendChild(editButton);

        const viewProfileButton = document.createElement('button');
        viewProfileButton.textContent = 'View Profile';
        viewProfileButton.classList.add('menu-dots-item');
        menuList.appendChild(viewProfileButton);

        const activateUserButton = document.createElement('button');
        activateUserButton.textContent = 'Activate User';
        activateUserButton.classList.add('activate-user-menu-item');
        menuList.appendChild(activateUserButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('menu-dots-item');
        menuList.appendChild(deleteButton);

        activateUserButton.addEventListener('click', function (event) {
            const targetRow = event.target.closest('tr');
            const userStatus = targetRow.querySelector('.table-status');

            if (userStatus.textContent === 'Inactive') {
                userStatus.textContent = 'Active';
                userStatus.style.color = '#4a4aff';
                userStatus.style.backgroundColor = '#e6e6f2';
            } else {
                userStatus.textContent = 'Inactive';
                userStatus.style.color = '#6E6893';
                userStatus.style.backgroundColor = '#F2F0F9';
            }
        });
    });
}

//User info section
function toggleTableUserInfo(event, userInfo = { userInfoDate: new Date().toDateString(), userInfoActivity: 'User Activity', userInfoDetail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies.' }) {
    const buttonTd = event.currentTarget;
    const tableRow = buttonTd.closest('tr');
    const buttonTdArrow = buttonTd.querySelector('img');
    buttonTdArrow.classList.toggle('arrow-flipped');

    const userInfoSection = tableRow.querySelector('.table-user-info');


    if (userInfoSection) {
        userInfoSection.remove();
    } else {


        const userInfoWrapper = document.createElement('div');
        userInfoWrapper.className = 'table-user-info';

        const userInfoList = document.createElement('div');
        userInfoList.className = 'table-user-info-list';

        const userInfoDate = document.createElement('div');
        userInfoDate.className = 'table-user-info-date';
        userInfoDate.innerHTML = userInfo.userInfoDate;

        const userInfoActivity = document.createElement('div');
        userInfoActivity.className = 'table-user-info-activity';
        userInfoActivity.innerHTML = userInfo.userInfoActivity;

        const userInfoDetail = document.createElement('div');
        userInfoDetail.className = 'table-user-info-detail';
        userInfoDetail.innerHTML = userInfo.userInfoDetail;

        userInfoWrapper.appendChild(userInfoList)
        userInfoList.appendChild(userInfoDate);
        userInfoList.appendChild(userInfoActivity);
        userInfoList.appendChild(userInfoDetail);
        tableRow.appendChild(userInfoWrapper);


        const userId = tableRow.id;
        const userRef = query(collection(db, 'users'));

        getDocs(userRef)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    userInfoDate.innerHTML = userData.lastLoginDate;
                    userInfoActivity.innerHTML = userData.userActivity;
                    userInfoDetail.innerHTML = userData.userDetail;
                });
            })
            .catch((error) => {
                console.log('No records found', error);
            });
    }
}


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
    updateFooterText()
}

function updateFooterText() {
    const startRow = (currentPage - 1) * rowsPerPage + 1;
    const endRow = startRow + rowsPerPage - 1 > tableRows.length ? tableRows.length : startRow + rowsPerPage - 1;
    rowsPerPageText.textContent = `Rows per page: ${rowsPerPage}`;
    rowsPerPageTotal.textContent = `${startRow}-${endRow} of ${tableRows.length} rows`;
}

// 
function updateTable() {
    const tableBody = document.getElementById('main__table-content');
    const tableRows = tableBody.getElementsByTagName('tr');
    displayRows(tableRows, currentPage, rowsPerPage);
    updateFooterText();
}

//dropdown numbers of strings
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

//Total amount of paid status
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
    totalAmountPayment.textContent = `$` + total + ` `;
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
    const filterMenu = document.querySelector('.filter-menu');
    filterMenu.classList.toggle('show');
    const filteredRows = filterTableRows();
    updateTableBody(filteredRows);
});