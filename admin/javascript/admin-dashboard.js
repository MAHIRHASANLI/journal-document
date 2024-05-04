import { getViewsWebSite } from '../api/dashboard_request.js';


// Get All Data
const totalDay = document.querySelector(".total-viewing-day");
const totalMonth = document.querySelector(".total-viewing-month");

getViewsWebSite().then((statistic) => {
    totalDay.textContent += statistic.view;
    totalMonth.textContent = statistic.view * 3;
});



// // // LOGOUT
const logOutBtn = document.querySelector('.dropdown-item')
logOutBtn.addEventListener('click', function () {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
        if (result.isConfirmed) {
            await firebase.auth().signOut().then(() => {
                SwalFire('Log Out successfully!', 'success');
            }).catch((error) => {
                SwalFire(`${error}:log Out error!!`, 'error');

            });
        }
    });
});