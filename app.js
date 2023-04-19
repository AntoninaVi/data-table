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
    name: 'Tatiana Doe',
    userStatus: 'Active',
    lastLoginDate: new Date(),
    paymentStatus: 'Paid',
    paymentDate: new Date(),
    paymentAmount: 200
})
    .then((docRef) => {
        console.log('Document written with ID: ', docRef.id);
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
            tr.appendChild(userStatusTd);
            tr.appendChild(paymentStatusTd);
            tr.appendChild(amountTd);
            tr.appendChild(viewMoreTd);
            tr.appendChild(menuDotsTd);
            userTableBody.appendChild(tr);

        })
    });





































